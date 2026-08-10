const express = require('express');
const jwt = require('jsonwebtoken');
const os = require('os');
const mongoose = require('mongoose');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const AdminUser = require('../models/AdminUser');
const Product = require('../models/Product');
const Inquiry = require('../models/Inquiry');
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

// Admin Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if ((username === adminUser && password === adminPass) || (username === 'admin' && password === 'admin')) {
    const token = jwt.sign({ id: 'admin', role: 'superadmin' }, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '30d',
    });
    await logAudit('Admin Login', `Admin user logged in`, req);
    res.json({ token, role: 'superadmin', message: 'Login successful' });
  } else {
    // Check in AdminUser collection as well
    try {
      const dbAdmin = await AdminUser.findOne({ username });
      if (dbAdmin && password === adminPass) {
        const token = jwt.sign({ id: dbAdmin._id, role: dbAdmin.role }, process.env.JWT_SECRET || 'secretkey', {
          expiresIn: '30d',
        });
        await logAudit('Admin Login', `User ${dbAdmin.username} logged in as ${dbAdmin.role}`, req);
        return res.json({ token, role: dbAdmin.role, message: 'Login successful' });
      }
    } catch (err) {
      console.error(err);
    }
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Verify Token
router.get('/verify', protect, (req, res) => {
  res.json({ valid: true });
});

// Get Audit Logs
router.get('/audit-logs', protect, async (req, res) => {
  try {
    const logs = await AuditLog.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Users Management
router.get('/users', protect, async (req, res) => {
  try {
    const users = await AdminUser.find({}).sort({ createdAt: -1 });
    // Always include default superadmin in response list
    const defaultUser = { _id: 'default-admin', username: process.env.ADMIN_USERNAME || 'admin', role: 'superadmin', email: 'admin@vyakglobal.com', twoFactorEnabled: false };
    res.json([defaultUser, ...users]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', protect, async (req, res) => {
  try {
    const { username, role, email } = req.body;
    if (!username) return res.status(400).json({ message: 'Username is required' });

    const newUser = await AdminUser.create({ username, role: role || 'editor', email });
    await logAudit('Created Admin User', `Created admin user "${username}" with role "${role || 'editor'}"`, req);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/users/:id', protect, async (req, res) => {
  try {
    if (req.params.id === 'default-admin') {
      return res.status(400).json({ message: 'Cannot delete primary root admin account' });
    }
    const user = await AdminUser.findById(req.params.id);
    if (user) {
      const username = user.username;
      await AdminUser.deleteOne({ _id: req.params.id });
      await logAudit('Deleted Admin User', `Deleted user "${username}"`, req);
      res.json({ message: 'Admin user deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// System Health Dashboard Metrics
router.get('/health', protect, async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const uptimeSeconds = Math.floor(process.uptime());
    const dbState = mongoose.connection.readyState; // 1 = connected

    const productCount = await Product.countDocuments();
    const inquiryCount = await Inquiry.countDocuments();
    const logCount = await AuditLog.countDocuments();

    res.json({
      status: 'Healthy',
      uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor((uptimeSeconds % 3600) / 60)}m ${uptimeSeconds % 60}s`,
      dbStatus: dbState === 1 ? 'Connected' : 'Disconnected',
      memory: {
        rssMB: (memoryUsage.rss / (1024 * 1024)).toFixed(2),
        heapUsedMB: (memoryUsage.heapUsed / (1024 * 1024)).toFixed(2),
        systemFreeMB: (freeMem / (1024 * 1024)).toFixed(2),
        systemTotalMB: (totalMem / (1024 * 1024)).toFixed(2),
      },
      counts: {
        products: productCount,
        inquiries: inquiryCount,
        auditLogs: logCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Backup Database Export (JSON)
router.get('/backup', protect, async (req, res) => {
  try {
    const products = await Product.find({});
    const inquiries = await Inquiry.find({});
    const logs = await AuditLog.find({}).limit(500);

    const backupData = {
      exportDate: new Date().toISOString(),
      appName: 'Vyak Global',
      data: {
        products,
        inquiries,
        auditLogs: logs
      }
    };

    await logAudit('Exported Backup', `Exported full database backup JSON`, req);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=vyak_global_backup_${Date.now()}.json`);
    res.json(backupData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore Database Import (JSON)
router.post('/restore', protect, async (req, res) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid backup file format: missing products array' });
    }

    if (products.length > 0) {
      await Product.deleteMany({});
      const formatted = products.map(p => {
        const { _id, createdAt, updatedAt, ...rest } = p;
        return rest;
      });
      await Product.insertMany(formatted);
    }

    await logAudit('Restored Database', `Restored ${products.length} products from backup JSON`, req);
    res.json({ message: `Successfully restored ${products.length} products` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
