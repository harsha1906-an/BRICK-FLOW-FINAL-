const mongoose = require('mongoose');

const invoiceUpdateSchema = new mongoose.Schema({
    invoice: {
        type: mongoose.Schema.ObjectId,
        ref: 'Invoice',
        required: true,
        autopopulate: true,
    },
    requestedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        required: true,
        autopopulate: true,
    },
    requestedChanges: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reason: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

invoiceUpdateSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('InvoiceUpdate', invoiceUpdateSchema);
