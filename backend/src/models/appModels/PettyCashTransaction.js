const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['inward', 'outward'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    receiptNumber: {
        type: String,
    },
    note: {
        type: String,
    },
    performedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        autopopulate: true,
    },
    removed: {
        type: Boolean,
        default: false,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('PettyCashTransaction', schema);
