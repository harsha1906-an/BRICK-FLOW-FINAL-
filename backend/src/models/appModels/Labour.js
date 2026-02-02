const mongoose = require('mongoose');

const LabourSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    skill: {
        type: String,
        enum: ['mason', 'electrician', 'plumber', 'helper', 'other'],
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    employmentType: {
        type: String,
        enum: ['daily', 'monthly', 'contract'],
        default: 'daily'
    },
    isSubstitute: {
        type: Boolean,
        default: false
    },
    dailyWage: {
        type: Number,
        default: 0
    },
    monthlySalary: {
        type: Number,
        default: 0
    },
    paymentDay: {
        type: Number,
        default: 1
    },
    phone: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Labour', LabourSchema);
