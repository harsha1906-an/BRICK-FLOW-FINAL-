const mongoose = require('mongoose');
const Villa = require('../models/appModels/Villa');

// Middleware to block update/delete for payments (append-only)
function blockPaymentEditDelete(req, res, next) {
  return res.status(403).json({
    code: 'PAYMENT_IMMUTABLE',
    message: 'Payments are append-only and cannot be updated or deleted.'
  });
}

// Middleware to enforce villa linkage and accountability on payment creation
async function enforceVillaOnPaymentCreate(req, res, next) {
  try {
    const { villaId, companyId } = req.body;
    if (!villaId) {
      return res.status(400).json({
        code: 'VILLA_REQUIRED',
        message: 'A valid villaId must be provided.'
      });
    }
    if (!mongoose.Types.ObjectId.isValid(villaId)) {
      return res.status(400).json({
        code: 'INVALID_VILLA_ID',
        message: 'villaId is not a valid ObjectId.'
      });
    }
    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({
        code: 'VILLA_NOT_FOUND',
        message: 'Villa does not exist.'
      });
    }
    if (companyId && villa.companyId.toString() !== companyId.toString()) {
      return res.status(400).json({
        code: 'VILLA_COMPANY_MISMATCH',
        message: 'Villa does not belong to the same company.'
      });
    }
    if (villa.isAccountable === false) {
      return res.status(400).json({
        code: 'NON_ACCOUNTABLE_VILLA',
        message: 'Payments are not allowed for non-accountable villas.'
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      code: 'VILLA_VALIDATION_ERROR',
      message: err.message
    });
  }
}

module.exports = {
  blockPaymentEditDelete,
  enforceVillaOnPaymentCreate
};
