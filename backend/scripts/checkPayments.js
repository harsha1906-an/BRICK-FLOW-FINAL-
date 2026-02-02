const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const checkPayments = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        // Define minimal schema to query
        const paymentSchema = new mongoose.Schema({ removed: Boolean, transactionCode: String }, { strict: false });
        const Payment = mongoose.model('Payment', paymentSchema);

        const count = await Payment.countDocuments({});
        console.log('Total Payments:', count);

        const nonRemoved = await Payment.countDocuments({ removed: false });
        console.log('Payments with removed: false:', nonRemoved);

        const undefinedRemoved = await Payment.countDocuments({ removed: { $exists: false } });
        console.log('Payments with removed undefined:', undefinedRemoved);

        const undefinedTransactionCode = await Payment.countDocuments({ transactionCode: { $exists: false } });
        console.log('Payments with transactionCode undefined:', undefinedTransactionCode);

        const allDocs = await Payment.find({}).limit(5);
        console.log('Sample Docs:', JSON.stringify(allDocs, null, 2));

        const invoiceSchema = new mongoose.Schema({}, { strict: false });
        const Invoice = mongoose.model('Invoice', invoiceSchema);
        const invoiceCount = await Invoice.countDocuments({});
        console.log('Total Invoices:', invoiceCount);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
    }
};

checkPayments();
