const AuditLog = require('./auditLog.model');

/**
 * Append an audit log entry. Fail-safe: errors are caught and do not block main flow.
 * @param {Object} logData - Audit log fields (companyId, userId, module, action, entityType, entityId, metadata)
 */
async function appendAuditLog(logData) {
  try {
    // Only allow fields defined in schema
    const {
      companyId,
      userId,
      module,
      action,
      entityType,
      entityId,
      metadata = {}
    } = logData;
    await AuditLog.create({
      companyId,
      userId,
      module,
      action,
      entityType,
      entityId,
      metadata
    });
  } catch (err) {
    // Fail-safe: log error but do not throw
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[AuditLog] Failed to write audit log:', err.message);
    }
  }
}

module.exports = {
  appendAuditLog,
};
