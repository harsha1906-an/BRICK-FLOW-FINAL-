const mongoose = require('mongoose');

const villaSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false,
    },
    villaNumber: {
        type: String,
        required: true,
    },
    houseType: {
        type: String,
    },
    builtUpArea: {
        type: Number,
    },
    status: {
        type: String,
        default: 'active',
    },
    isAccountable: {
        type: Boolean,
        default: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

villaSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Villa', villaSchema);
