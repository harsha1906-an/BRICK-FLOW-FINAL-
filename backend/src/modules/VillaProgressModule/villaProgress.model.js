const mongoose = require('mongoose');

const VillaProgressSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  villaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Villa',
    required: true,
    index: true
  },
  stage: {
    type: String,
    enum: ['foundation', 'structure', 'plastering', 'finishing', 'other'],
    required: true
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  notes: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Overwrite-last: Only one progress per villa per company
VillaProgressSchema.index({ companyId: 1, villaId: 1 }, { unique: true });

module.exports = mongoose.model('VillaProgress', VillaProgressSchema);
