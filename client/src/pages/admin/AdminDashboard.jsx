import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5001');
    try {
      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = isEditing 
      ? `http://localhost:5001/api/products/${currentProduct._id}`
      : 'http://localhost:5001/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setFormData({ name: '', description: '', price: '', imageUrl: '' });
        setIsEditing(false);
        setCurrentProduct(null);
        fetchProducts();
      } else {
        alert('Failed to save product. Token might be expired.');
        handleLogout();
      }
    } catch (error) {
      console.error('Error saving product', error);
    }
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl || ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`http://localhost:5001/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete. Token might be expired.');
        handleLogout();
      }
    } catch (error) {
      console.error('Error deleting product', error);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '' });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <nav className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">View Site</button>
          <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-colors">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8 mt-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 sticky top-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Price</label>
                <input required type="number" name="price" value={formData.price} onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
                  {isEditing ? 'Update Product' : 'Save Product'}
                </button>
                {isEditing && (
                  <button type="button" onClick={cancelEdit} className="px-4 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Product List Section */}
        <div className="md:col-span-2">
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-6">Product List</h2>
            {products.length === 0 ? (
              <p className="text-slate-400">No products found. Create one above.</p>
            ) : (
              <div className="space-y-4">
                {products.map(product => (
                  <div key={product._id} className="flex flex-col sm:flex-row gap-4 p-4 border border-slate-700 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors items-center">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2">{product.description}</p>
                      <p className="text-blue-400 font-medium mt-1">${product.price}</p>
                    </div>
                    <div className="flex flex-row sm:flex-col gap-2">
                      <button onClick={() => handleEdit(product)} className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors">Edit</button>
                      <button onClick={() => handleDelete(product._id)} className="px-3 py-1 text-sm bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
