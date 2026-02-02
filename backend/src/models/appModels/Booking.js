const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    removed: {
        type: Boolean,
        default: false,
    },
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
        required: false,
    },
    villa: {
        type: mongoose.Schema.ObjectId,
        ref: 'Villa',
        required: true,
        autopopulate: true,
    },
    client: {
        type: mongoose.Schema.ObjectId,
        ref: 'Client',
        required: true,
        autopopulate: true,
    },
    bookingDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    officialAmount: {
        type: Number,
        default: 0,
    },
    internalAmount: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked',
    },
    paymentPlan: [{
        no: Number,
        name: { type: String, required: true },
        amount: { type: Number, required: true },
        dueDate: Date,
        status: {
            type: String,
            enum: ['pending', 'paid', 'overdue', 'partially'],
            default: 'pending'
        },
        paidAmount: { type: Number, default: 0 },
        paymentDate: Date,
        notes: String
    }],
    notes: String,
    updated: {
        type: Date,
        default: Date.now,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

bookingSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Booking', bookingSchema);
