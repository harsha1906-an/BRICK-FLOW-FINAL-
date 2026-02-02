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
    purchaseOrder: {
        type: mongoose.Schema.ObjectId,
        ref: 'PurchaseOrder',
        required: true,
    },
    items: [
        {
            material: { type: mongoose.Schema.ObjectId, ref: 'Material' }, // Optional link if items match Materials
            itemName: { type: String, required: true },
            quantityReceived: { type: Number, required: true },
        }
    ],
    notes: {
        type: String,
    },
    receivedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Admin',
        autopopulate: true,
    },
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
module.exports = mongoose.model('GoodsReceipt', schema);
