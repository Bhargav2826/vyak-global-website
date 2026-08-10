import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [health, setHealth] = useState(null);

  // Filters & State for Product Tab
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: 'Spices',
    tags: '',
    stock: 100,
    isDraft: false,
    isFeatured: false,
    metaTitle: '',
    metaDescription: ''
  });

  // Bulk Import State
  const [csvText, setCsvText] = useState('');
  const [bulkPreview, setBulkPreview] = useState([]);
  const [bulkSuccess, setBulkSuccess] = useState('');

  // Admin User Form
  const [newUser, setNewUser] = useState({ username: '', role: 'editor', email: '' });

  const navigate = useNavigate();

  useEffect(() => {
    const refreshAll = () => {
      fetchProducts();
      fetchInquiries();
      fetchAuditLogs();
      fetchAdminUsers();
      fetchHealth();
    };

    refreshAll();

    // Auto-refresh inquiries & stats every 15 seconds
    const interval = setInterval(refreshAll, 15000);

    // Refresh when admin switches back to tab
    const handleFocus = () => refreshAll();
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // --- API FETCHING ---
  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE}/api/products?includeDrafts=true`);
      const data = await response.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  }

  async function fetchInquiries() {
    try {
      const response = await fetch(`${API_BASE}/api/inquiries`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setInquiries(data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries', error);
    }
  }

  async function fetchAuditLogs() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/audit-logs`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setAuditLogs(data);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs', error);
    }
  }

  async function fetchAdminUsers() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) setAdminUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch admin users', error);
    }
  }

  async function fetchHealth() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/health`, { headers: getHeaders() });
      if (response.ok) {
        const data = await response.json();
        setHealth(data);
      }
    } catch (error) {
      console.error('Failed to fetch health data', error);
    }
  }

  // --- PRODUCT CRUD ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Convert File to Base64 for Image Upload
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `${API_BASE}/api/products/${currentProduct._id}`
      : `${API_BASE}/api/products`;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : formData.tags
        })
      });

      if (response.ok) {
        resetForm();
        fetchProducts();
        fetchAuditLogs();
        fetchHealth();
        setActiveTab('products');
      } else {
        alert('Failed to save product. Session may have expired.');
      }
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      imageUrl: product.imageUrl || '',
      category: product.category || 'General',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      stock: product.stock !== undefined ? product.stock : 100,
      isDraft: Boolean(product.isDraft),
      isFeatured: Boolean(product.isFeatured),
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || ''
    });
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (response.ok) {
        fetchProducts();
        fetchAuditLogs();
        fetchHealth();
      }
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      category: 'Spices',
      tags: '',
      stock: 100,
      isDraft: false,
      isFeatured: false,
      metaTitle: '',
      metaDescription: ''
    });
  };

  // Re-ordering products (Move Up / Down)
  const handleMoveProduct = async (index, direction) => {
    const newProducts = [...products];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newProducts.length) return;

    const temp = newProducts[index];
    newProducts[index] = newProducts[targetIndex];
    newProducts[targetIndex] = temp;

    setProducts(newProducts);

    // Save order to DB
    const orderedIds = newProducts.map(p => p._id);
    try {
      await fetch(`${API_BASE}/api/products/reorder`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ orderedIds })
      });
    } catch (err) {
      console.error('Failed to save order', err);
    }
  };

  // --- BULK CSV / JSON IMPORT ---
  const handleParseCsv = () => {
    try {
      // Basic CSV parser
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        // Try JSON parse if user pasted JSON
        const parsed = JSON.parse(csvText);
        setBulkPreview(Array.isArray(parsed) ? parsed : [parsed]);
        return;
      }
      const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
      const items = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = values[i] || '';
        });
        return obj;
      });
      setBulkPreview(items);
    } catch (e) {
      alert('Could not parse input. Please ensure it is valid CSV or JSON array.');
    }
  };

  const handleExecuteBulkImport = async () => {
    if (bulkPreview.length === 0) return;
    try {
      const response = await fetch(`${API_BASE}/api/products/bulk`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bulkPreview)
      });
      if (response.ok) {
        setBulkSuccess(`✅ Successfully imported ${bulkPreview.length} products!`);
        setBulkPreview([]);
        setCsvText('');
        fetchProducts();
        fetchAuditLogs();
      } else {
        alert('Failed to import products.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- INQUIRY ACTIONS ---
  const handleUpdateInquiryStatus = async (id, status) => {
    try {
      await fetch(`${API_BASE}/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      fetchInquiries();
      fetchAuditLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await fetch(`${API_BASE}/api/inquiries/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ADMIN USERS CRUD ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        setNewUser({ username: '', role: 'editor', email: '' });
        fetchAdminUsers();
        fetchAuditLogs();
      } else {
        const d = await res.json();
        alert(d.message || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete admin user?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        fetchAdminUsers();
        fetchAuditLogs();
      } else {
        const d = await res.json();
        alert(d.message || 'Cannot delete user');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- BACKUP & RESTORE ---
  const handleDownloadBackup = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/backup`, { headers: getHeaders() });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vyak_global_backup_${Date.now()}.json`;
      a.click();
    } catch (err) {
      alert('Failed to download backup');
    }
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        const productsToRestore = parsed.data?.products || (Array.isArray(parsed) ? parsed : []);
        if (!Array.isArray(productsToRestore)) {
          alert('Invalid backup format');
          return;
        }

        if (window.confirm(`Are you sure you want to restore ${productsToRestore.length} products? This will replace current catalog!`)) {
          const res = await fetch(`${API_BASE}/api/admin/restore`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ products: productsToRestore })
          });
          if (res.ok) {
            alert('Database restored successfully!');
            fetchProducts();
            fetchAuditLogs();
          }
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  // --- FILTERED PRODUCTS LIST ---
  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || 
                          (statusFilter === 'Published' && !p.isDraft) ||
                          (statusFilter === 'Drafts' && p.isDraft) ||
                          (statusFilter === 'Featured' && p.isFeatured);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categoriesList = ['All', ...new Set(products.map(p => p.category || 'General'))];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              V
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide">Vyak Global</h1>
              <p className="text-xs text-amber-400 font-medium">Admin Control Panel</p>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'overview', label: 'Overview & Analytics', icon: '📊' },
              { id: 'products', label: 'Product Catalog', icon: '🌶️', count: products.length },
              { id: 'bulk', label: 'Bulk Import & Media', icon: '📥' },
              { id: 'inquiries', label: 'Inquiries & Requests', icon: '📩', count: inquiries.filter(i => i.status === 'New').length },
              { id: 'security', label: 'Audit Logs & Users', icon: '🛡️' },
              { id: 'system', label: 'System & Backup', icon: '⚙️' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </div>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    tab.id === 'inquiries' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <span>🌐</span> View Public Site
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors">
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">

        {/* 1. OVERVIEW & ANALYTICS TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h2>
              <p className="text-slate-400 text-sm mt-1">Real-time statistics and quick actions for Vyak Global.</p>
            </div>

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-slate-400 text-sm">
                  <span>Total Products</span>
                  <span className="text-amber-400 text-lg">📦</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-3">{products.length}</div>
                <div className="text-xs text-slate-500 mt-2">
                  {products.filter(p => !p.isDraft).length} Published • {products.filter(p => p.isDraft).length} Drafts
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-slate-400 text-sm">
                  <span>Featured Items</span>
                  <span className="text-amber-400 text-lg">⭐</span>
                </div>
                <div className="text-3xl font-extrabold text-amber-400 mt-3">
                  {products.filter(p => p.isFeatured).length}
                </div>
                <div className="text-xs text-slate-500 mt-2">Promoted on home collection</div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-slate-400 text-sm">
                  <span>Catalog Requests</span>
                  <span className="text-blue-400 text-lg">📩</span>
                </div>
                <div className="text-3xl font-extrabold text-white mt-3">{inquiries.length}</div>
                <div className="text-xs text-amber-400 mt-2">
                  {inquiries.filter(i => i.status === 'New').length} new unread requests
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center text-slate-400 text-sm">
                  <span>System Status</span>
                  <span className="text-emerald-400 text-lg">💚</span>
                </div>
                <div className="text-xl font-bold text-emerald-400 mt-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  {health ? health.dbStatus : 'Connected'}
                </div>
                <div className="text-xs text-slate-500 mt-2">Server uptime: {health?.uptime || 'Online'}</div>
              </div>
            </div>

            {/* CATEGORY BREAKDOWN & QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="font-semibold text-white mb-4">Category Distribution</h3>
                <div className="space-y-4">
                  {categoriesList.filter(c => c !== 'All').map(cat => {
                    const count = products.filter(p => (p.category || 'General') === cat).length;
                    const percentage = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 font-medium">{cat}</span>
                          <span className="text-slate-400">{count} products ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                          <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
                  <div className="space-y-3">
                    <button onClick={() => { resetForm(); setActiveTab('products'); }} className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors text-left flex items-center justify-between">
                      <span>+ Add New Product</span>
                      <span>→</span>
                    </button>
                    <button onClick={() => setActiveTab('bulk')} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-colors text-left flex items-center justify-between">
                      <span>📥 Bulk CSV Import</span>
                      <span>→</span>
                    </button>
                    <button onClick={handleDownloadBackup} className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl text-sm transition-colors text-left flex items-center justify-between">
                      <span>⚙️ Export Database Backup</span>
                      <span>↓</span>
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
                  Last database sync: Just now
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT CATALOG & EDITOR TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Product Catalog</h2>
                <p className="text-slate-400 text-sm">Manage products, pricing, stock, and SEO meta tags.</p>
              </div>
              <button
                onClick={() => { resetForm(); setIsEditing(false); }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
              >
                <span>+</span> Add Product
              </button>
            </div>

            {/* PRODUCT FORM (Modal / Expandable Box) */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>{isEditing ? '✏️ Edit Product' : '➕ Create New Product'}</span>
              </h3>
              <form onSubmit={handleSubmitProduct} className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Product Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="e.g. Premium Cumin Seeds" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <input type="text" name="category" value={formData.category} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="e.g. Spices, Herbs" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Price ($)</label>
                  <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="15.99" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="2"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="High quality organic spice exported worldwide..."></textarea>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Stock Quantity</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Image URL or Local Upload</label>
                  <div className="flex gap-2">
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange}
                      className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="https://example.com/image.jpg" />
                    <label className="cursor-pointer px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs text-slate-300 font-medium flex items-center justify-center shrink-0">
                      <span>📷 Upload File</span>
                      <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tags (Comma Separated)</label>
                  <input type="text" name="tags" value={formData.tags} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="organic, wholesale, seeds" />
                </div>

                {/* SEO Meta Tags */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SEO Meta Title</label>
                  <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="Buy Cumin Seeds Online" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">SEO Meta Description</label>
                  <input type="text" name="metaDescription" value={formData.metaDescription} onChange={handleInputChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-amber-500 focus:outline-none" placeholder="Best quality wholesale spice export..." />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input type="checkbox" name="isDraft" checked={formData.isDraft} onChange={handleInputChange} className="w-4 h-4 accent-amber-500 rounded" />
                    <span>Save as Draft</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-300">
                    <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4 accent-amber-500 rounded" />
                    <span>Featured Product</span>
                  </label>
                </div>

                <div className="md:col-span-3 flex justify-end gap-3 pt-2">
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors">
                      Cancel
                    </button>
                  )}
                  <button type="submit" className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors">
                    {isEditing ? 'Update Product' : 'Save Product'}
                  </button>
                </div>
              </form>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
              <input
                type="text"
                placeholder="🔍 Search products..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />

              <div className="flex gap-3 w-full sm:w-auto">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none"
                >
                  {categoriesList.map(cat => <option key={cat} value={cat}>Category: {cat}</option>)}
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-300 focus:outline-none"
                >
                  <option value="All">Status: All</option>
                  <option value="Published">Published</option>
                  <option value="Drafts">Drafts Only</option>
                  <option value="Featured">Featured Only</option>
                </select>
              </div>
            </div>

            {/* PRODUCT LIST TABLE */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Order</th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-slate-500">No products found matching filters.</td>
                      </tr>
                    ) : (
                      filteredProducts.map((product, idx) => (
                        <tr key={product._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="flex gap-1">
                              <button onClick={() => handleMoveProduct(idx, 'up')} disabled={idx === 0} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs">▲</button>
                              <button onClick={() => handleMoveProduct(idx, 'down')} disabled={idx === filteredProducts.length - 1} className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 rounded text-xs">▼</button>
                            </div>
                          </td>
                          <td className="p-4 flex items-center gap-3">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt="" className="w-10 h-10 object-cover rounded-lg bg-slate-800" />
                            ) : (
                              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs">No img</div>
                            )}
                            <div>
                              <div className="font-semibold text-white">{product.name}</div>
                              <div className="text-xs text-slate-400 line-clamp-1">{product.description}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">
                              {product.category || 'General'}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-amber-400">${product.price}</td>
                          <td className="p-4">
                            <span className={`text-xs font-medium ${product.stock < 10 ? 'text-red-400 font-bold' : 'text-slate-300'}`}>
                              {product.stock || 100} units
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {product.isDraft ? (
                                <span className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-xs">Draft</span>
                              ) : (
                                <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs font-medium">Live</span>
                              )}
                              {product.isFeatured && (
                                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-xs font-medium">⭐ Featured</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEditProduct(product)} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors">Edit</button>
                              <button onClick={() => handleDeleteProduct(product._id)} className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs font-medium transition-colors">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. BULK IMPORT & MEDIA TAB */}
        {activeTab === 'bulk' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Bulk CSV / JSON Import</h2>
              <p className="text-slate-400 text-sm">Upload multiple product records at once into your catalog.</p>
            </div>

            {bulkSuccess && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-sm font-medium">
                {bulkSuccess}
              </div>
            )}

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-white text-sm">Paste CSV or JSON Data</h3>
              <p className="text-xs text-slate-400">
                Format columns: <code>name, description, price, category, imageUrl, stock</code>
              </p>
              <textarea
                rows="6"
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={`name,description,price,category,stock\nOrganic Turmeric Powder,Freshly ground spices,12.50,Spices,200\nCardamom Pods,Export grade green cardamom,28.00,Spices,150`}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-500"
              ></textarea>

              <div className="flex justify-between items-center">
                <button onClick={handleParseCsv} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm transition-colors">
                  Preview Import
                </button>
                {bulkPreview.length > 0 && (
                  <button onClick={handleExecuteBulkImport} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors">
                    Confirm & Save {bulkPreview.length} Items
                  </button>
                )}
              </div>
            </div>

            {/* PREVIEW TABLE */}
            {bulkPreview.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-white text-sm">Import Preview ({bulkPreview.length} items)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800 text-slate-400">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Name</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {bulkPreview.map((item, i) => (
                        <tr key={i}>
                          <td className="p-3 text-slate-500">{i + 1}</td>
                          <td className="p-3 font-semibold text-white">{item.name}</td>
                          <td className="p-3 text-slate-400">{item.description}</td>
                          <td className="p-3 text-amber-400">${item.price}</td>
                          <td className="p-3">{item.category || 'General'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. INQUIRIES & CATALOG REQUESTS TAB */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Customer Inquiries & Catalog Requests</h2>
              <p className="text-slate-400 text-sm">Messages submitted by potential buyers on the public website.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800 text-xs uppercase text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Request Type</th>
                      <th className="p-4">Message</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-slate-500">No customer inquiries received yet.</td>
                      </tr>
                    ) : (
                      inquiries.map(inq => (
                        <tr key={inq._id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="font-semibold text-white">{inq.name}</div>
                            <div className="text-xs text-slate-400">{inq.email} • {inq.phone || 'No phone'}</div>
                            {inq.company && <div className="text-xs text-amber-400 font-medium mt-0.5">{inq.company}</div>}
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-300">
                              {inq.requestType || 'Catalog Request'}
                            </span>
                          </td>
                          <td className="p-4 text-slate-300 text-xs max-w-xs">{inq.message}</td>
                          <td className="p-4 text-xs text-slate-400">{new Date(inq.createdAt).toLocaleDateString()}</td>
                          <td className="p-4">
                            <select
                              value={inq.status}
                              onChange={e => handleUpdateInquiryStatus(inq._id, e.target.value)}
                              className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                                inq.status === 'New' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                                inq.status === 'In Progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                                'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              <option value="New" className="bg-slate-900 text-slate-200">New</option>
                              <option value="In Progress" className="bg-slate-900 text-slate-200">In Progress</option>
                              <option value="Resolved" className="bg-slate-900 text-slate-200">Resolved</option>
                            </select>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => handleDeleteInquiry(inq._id)} className="px-3 py-1 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg text-xs transition-colors">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. AUDIT LOGS & USER SECURITY TAB */}
        {activeTab === 'security' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Audit Logs & Admin Access</h2>
              <p className="text-slate-400 text-sm">Monitor activity logs and manage team permissions.</p>
            </div>

            {/* ADMIN USER MANAGEMENT */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="font-semibold text-white mb-4 text-sm">Add Admin Account</h3>
                <form onSubmit={handleCreateUser} className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                    <input required type="text" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" placeholder="manager_john" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
                      <option value="editor">Editor (Products only)</option>
                      <option value="superadmin">Super Admin (Full Access)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                    <input type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none" placeholder="john@vyakglobal.com" />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors mt-2">
                    Create User
                  </button>
                </form>
              </div>

              <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <h3 className="font-semibold text-white mb-4 text-sm">Active Admin Users</h3>
                <div className="space-y-3">
                  {adminUsers.map(user => (
                    <div key={user._id} className="flex justify-between items-center p-3 bg-slate-800/60 rounded-xl border border-slate-800">
                      <div>
                        <div className="font-semibold text-white text-sm">{user.username}</div>
                        <div className="text-xs text-slate-400">{user.email || 'No email'} • Role: <span className="text-amber-400">{user.role}</span></div>
                      </div>
                      {user._id !== 'default-admin' && (
                        <button onClick={() => handleDeleteUser(user._id)} className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs">Remove</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AUDIT LOG TABLE */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-semibold text-white text-sm">System Audit Activity Log</h3>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 sticky top-0">
                    <tr>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Details</th>
                      <th className="p-3">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {auditLogs.map(log => (
                      <tr key={log._id} className="hover:bg-slate-800/40">
                        <td className="p-3 text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                        <td className="p-3 font-semibold text-amber-400">{log.action}</td>
                        <td className="p-3 text-slate-300">{log.details}</td>
                        <td className="p-3 text-slate-500 font-mono">{log.ipAddress || 'Internal'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. SYSTEM & BACKUP TAB */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">System & Database Management</h2>
              <p className="text-slate-400 text-sm">Export/Import database snapshots and view server metrics.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* BACKUP / RESTORE CARD */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-5">
                <h3 className="font-semibold text-white text-base">Database Backup & Restore</h3>
                <p className="text-xs text-slate-400">Download a full JSON snapshot of your products and catalog data for safe keeping.</p>

                <div className="space-y-3">
                  <button onClick={handleDownloadBackup} className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                    <span>💾</span> Export Backup JSON
                  </button>

                  <div className="pt-3 border-t border-slate-800">
                    <label className="block text-xs font-medium text-slate-400 mb-2">Restore Snapshot from JSON</label>
                    <input type="file" accept=".json" onChange={handleRestoreBackup} className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-amber-400 hover:file:bg-slate-700" />
                  </div>
                </div>
              </div>

              {/* HEALTH METRICS CARD */}
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="font-semibold text-white text-base">Server Health & Environment</h3>
                {health ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl">
                      <span className="text-slate-400">Database Status</span>
                      <span className="font-bold text-emerald-400">{health.dbStatus}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl">
                      <span className="text-slate-400">Server Uptime</span>
                      <span className="font-bold text-white">{health.uptime}</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl">
                      <span className="text-slate-400">Heap Memory Used</span>
                      <span className="font-bold text-amber-400">{health.memory?.heapUsedMB} MB</span>
                    </div>
                    <div className="flex justify-between p-2.5 bg-slate-800/60 rounded-xl">
                      <span className="text-slate-400">System Free RAM</span>
                      <span className="font-bold text-slate-200">{health.memory?.systemFreeMB} MB / {health.memory?.systemTotalMB} MB</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Loading metrics...</p>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default AdminDashboard;
