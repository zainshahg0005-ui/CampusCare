const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      enum: ['AUTH', 'COMPLAINTS', 'SECURITY', 'SUPPORT', 'SYSTEM'],
      default: 'SYSTEM',
      index: true,
    },
    severity: {
      type: String,
      enum: ['info', 'success', 'warning', 'critical'],
      default: 'info',
    },
    actor: {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      name: { type: String, default: 'System' },
      email: { type: String, default: '' },
      role: { type: String, enum: ['student', 'admin', 'system', 'guest'], default: 'system' },
    },
    details: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast querying, filtering and sorting
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ category: 1, createdAt: -1 });
auditLogSchema.index({ 'actor.id': 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
