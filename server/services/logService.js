const AuditLog = require('../models/AuditLog');

/**
 * Creates an audit log entry in MongoDB
 * Non-blocking: will never crash the calling function
 */
const logActivity = async ({
  action,
  category = 'SYSTEM',
  severity = 'info',
  actor = {},
  details,
  metadata = {},
  req = null,
}) => {
  try {
    let ipAddress = '';
    if (req) {
      ipAddress =
        req.headers['x-forwarded-for'] ||
        req.socket?.remoteAddress ||
        req.ip ||
        '';
      if (ipAddress.includes(',')) {
        ipAddress = ipAddress.split(',')[0].trim();
      }
    }

    await AuditLog.create({
      action: String(action || 'UNKNOWN_ACTION').toUpperCase(),
      category: ['AUTH', 'COMPLAINTS', 'SECURITY', 'SUPPORT', 'SYSTEM'].includes(category)
        ? category
        : 'SYSTEM',
      severity: ['info', 'success', 'warning', 'critical'].includes(severity)
        ? severity
        : 'info',
      actor: {
        id: actor.id || actor._id || null,
        name: actor.name || 'System',
        email: actor.email || '',
        role: actor.role || 'system',
      },
      details: String(details || 'No details provided'),
      metadata: metadata || {},
      ipAddress,
    });
  } catch (err) {
    console.error('[Audit Log Service Error]:', err.message);
  }
};

module.exports = {
  logActivity,
};
