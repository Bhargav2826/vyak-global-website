const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    enum: ['Catalog Request', 'General Inquiry', 'Bulk Order'],
    default: 'General Inquiry',
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Resolved'],
    default: 'New',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inquiry', inquirySchema);
