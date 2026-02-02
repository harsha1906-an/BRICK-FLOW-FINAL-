// Centralized audit log hooks for BrickFlow modules
const { logAuditAction } = require('./auditLog.middleware');

/**
 * Call after successful create/update for Villa, Payment, Expense, Labour, Attendance, Progress.
 * Call after blocked Payment edit/delete attempts and unauthorized/cross-company attempts if detectable.
 * Usage: Import and call in controller/service after main operation.
 */

module.exports = {
  logAuditAction,
};
