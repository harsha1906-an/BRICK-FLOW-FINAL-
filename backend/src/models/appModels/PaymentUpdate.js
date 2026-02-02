const mongoose = require('mongoose');

const paymentUpdateSchema = new mongoose.Schema({
    payment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Payment',
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
        type: mongoose.Schema.Types.Mixed, // Stores the fields to be updated
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

paymentUpdateSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PaymentUpdate', paymentUpdateSchema);
