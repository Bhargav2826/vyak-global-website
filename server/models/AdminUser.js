const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'editor'],
    default: 'editor',
  },
  email: {
    type: String,
    default: '',
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminUser', adminUserSchema);
