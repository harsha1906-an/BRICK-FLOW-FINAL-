const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    villa: {
        type: mongoose.Schema.ObjectId,
        ref: 'Villa',
        required: true,
        autopopulate: true,
    },
    material: {
        type: mongoose.Schema.ObjectId,
        ref: 'Material',
        required: true,
        autopopulate: true,
    },
    currentStock: {
        type: Number,
        default: 0,
        required: true,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    removed: {
        type: Boolean,
        default: false,
    },
});

schema.plugin(require('mongoose-autopopulate'));
schema.index({ villa: 1, material: 1 }, { unique: true }); // Ensure unique stock record per material per villa

module.exports = mongoose.model('VillaStock', schema);
