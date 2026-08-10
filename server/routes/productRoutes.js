const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/authMiddleware');

// Helper to log audit actions
const logAudit = async (action, details, req) => {
  try {
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    await AuditLog.create({
      action,
      performedBy: 'Admin',
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Audit log error:', err);
  }
};

// Get all products (Public: filter out drafts, Admin can pass ?includeDrafts=true)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.includeDrafts !== 'true') {
      filter.isDraft = { $ne: true };
    }
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    const products = await Product.find(filter).sort({ position: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Bulk Insert Products (Admin only)
router.post('/bulk', protect, async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Invalid payload, expected array of products' });
    }
    const formatted = items.map(item => ({
      name: item.name || 'Untitled Product',
      description: item.description || '',
      price: Number(item.price) || 0,
      imageUrl: item.imageUrl || item.image || '',
      category: item.category || 'General',
      tags: Array.isArray(item.tags) ? item.tags : (item.tags ? String(item.tags).split(',').map(t => t.trim()) : []),
      isDraft: Boolean(item.isDraft),
      isFeatured: Boolean(item.isFeatured),
      stock: item.stock !== undefined ? Number(item.stock) : 100,
      metaTitle: item.metaTitle || '',
      metaDescription: item.metaDescription || ''
    }));

    const created = await Product.insertMany(formatted);
    await logAudit('Bulk Product Import', `Imported ${created.length} products`, req);
    res.status(201).json(created);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Re-order Products (Admin only)
router.put('/reorder', protect, async (req, res) => {
  try {
    const { orderedIds } = req.body; // Array of product IDs in desired order
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'orderedIds array required' });
    }

    const updates = orderedIds.map((id, index) => 
      Product.findByIdAndUpdate(id, { position: index })
    );
    await Promise.all(updates);

    await logAudit('Re-ordered Catalog', `Updated positions for ${orderedIds.length} products`, req);
    res.json({ message: 'Product order updated successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a product (Admin only)
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, tags, isDraft, isFeatured, stock, metaTitle, metaDescription } = req.body;
    const product = new Product({
      name,
      description,
      price: Number(price),
      imageUrl,
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : []),
      isDraft: Boolean(isDraft),
      isFeatured: Boolean(isFeatured),
      stock: stock !== undefined ? Number(stock) : 100,
      metaTitle: metaTitle || '',
      metaDescription: metaDescription || ''
    });
    const createdProduct = await product.save();

    await logAudit('Created Product', `Product "${createdProduct.name}" (ID: ${createdProduct._id})`, req);
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product (Admin only)
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, description, price, imageUrl, category, tags, isDraft, isFeatured, stock, metaTitle, metaDescription } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name !== undefined ? name : product.name;
      product.description = description !== undefined ? description : product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.imageUrl = imageUrl !== undefined ? imageUrl : product.imageUrl;
      product.category = category !== undefined ? category : product.category;
      if (tags !== undefined) {
        product.tags = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim());
      }
      if (isDraft !== undefined) product.isDraft = Boolean(isDraft);
      if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
      if (stock !== undefined) product.stock = Number(stock);
      if (metaTitle !== undefined) product.metaTitle = metaTitle;
      if (metaDescription !== undefined) product.metaDescription = metaDescription;

      const updatedProduct = await product.save();
      await logAudit('Updated Product', `Product "${updatedProduct.name}" (ID: ${updatedProduct._id})`, req);
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (Admin only)
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      const productName = product.name;
      await Product.deleteOne({ _id: req.params.id });
      await logAudit('Deleted Product', `Product "${productName}" (ID: ${req.params.id})`, req);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
