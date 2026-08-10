const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
  },
  performedBy: {
    type: String,
    default: 'admin',
  },
  details: {
    type: String,
    default: '',
  },
  ipAddress: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
