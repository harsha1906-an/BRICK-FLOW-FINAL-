const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    number: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'submitted', 'approved', 'rejected'],
    },
    vendor: {
        type: String,
        required: true,
    },
    details: [
        {
            itemName: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true },
            amount: { type: Number, required: true },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin', autopopulate: true },
    auditLog: [
        {
            status: String,
            user: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
            date: { type: Date, default: Date.now },
            reason: String,
        },
    ],
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PurchaseOrder', schema);
