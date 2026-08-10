const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit an inquiry or catalog request
router.post('/', async (req, res) => {
  try {
    const { name, email, company, phone, message, requestType } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      company: company || '',
      phone: phone || '',
      message,
      requestType: requestType || 'General Inquiry'
    });

    res.status(201).json({ message: 'Inquiry submitted successfully', inquiry });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Get all inquiries
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Update inquiry status (New -> In Progress -> Resolved)
router.patch('/:id', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });

    inquiry.status = status || inquiry.status;
    await inquiry.save();

    await AuditLog.create({
      action: 'Updated Inquiry Status',
      performedBy: 'Admin',
      details: `Updated inquiry ID ${inquiry._id} to status "${inquiry.status}"`
    });

    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete inquiry
router.delete('/:id', protect, async (req, res) => {
  try {
    await Inquiry.deleteOne({ _id: req.params.id });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
