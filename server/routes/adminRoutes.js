const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin';

  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ id: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.get('/verify', protect, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
