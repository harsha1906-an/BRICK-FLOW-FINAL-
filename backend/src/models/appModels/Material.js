const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    enabled: {
        type: Boolean,
        default: true,
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String, // e.g. Cement, Steel, Bricks, Electrical, Plumbing, Other
        default: 'Other',
    },
    unit: {
        type: String, // e.g. Bags, Kg, Tons, Nos, Ltr
        required: true,
    },
    currentStock: {
        type: Number,
        default: 0,
    },
    reorderLevel: {
        type: Number,
        default: 0, // 0 means no alert
    },
    description: {
        type: String,
    },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
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

module.exports = mongoose.model('Material', schema);
