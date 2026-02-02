// Export AuditLog model, service, and middleware for use in other modules
const AuditLog = require('./auditLog.model');
const { appendAuditLog } = require('./auditLog.service');
const { logAuditAction } = require('./auditLog.middleware');

module.exports = {
  AuditLog,
  appendAuditLog,
  logAuditAction,
};
