const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: true,
        autopopulate: true,
    },
    type: {
        type: String,
        enum: ['inward', 'outward', 'adjustment'],
        required: true,
    },
    project: {
        type: mongoose.Schema.ObjectId,
        ref: 'Project',
        autopopulate: true,
    },
    villa: {
        type: mongoose.Schema.ObjectId,
        ref: 'Villa',
        autopopulate: true,
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier',
        autopopulate: true,
    },
    usageCategory: {
        type: String,
        enum: ['daily_work', 'waste', 'transfer', 'adjustment', 'other'],
        default: 'daily_work',
    },
    quantity: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    reference: {
        type: String, // PO Number, Receiver Name, Usage Location, etc.
    },
    notes: {
        type: String,
    },
    performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('InventoryTransaction', schema);
