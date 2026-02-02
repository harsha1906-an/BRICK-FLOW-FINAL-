const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const mongoose = require('mongoose');

const checkPayments = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        // Define minimal schema to query
        const paymentSchema = new mongoose.Schema({ removed: Boolean }, { strict: false });
        const Payment = mongoose.model('Payment', paymentSchema);

        const count = await Payment.countDocuments({});
        console.log('Total Payments:', count);

        const nonRemoved = await Payment.countDocuments({ removed: false });
        console.log('Payments with removed: false:', nonRemoved);

        const undefinedRemoved = await Payment.countDocuments({ removed: { $exists: false } });
        console.log('Payments with removed undefined:', undefinedRemoved);

        const allDocs = await Payment.find({}).limit(5);
        console.log('Sample Docs:', JSON.stringify(allDocs, null, 2));

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.connection.close();
    }
};

checkPayments();
