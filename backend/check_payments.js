const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        // Define temporary schema to avoid missing model errors if not loaded
        const paymentSchema = new mongoose.Schema({}, { strict: false, collection: 'payments' });
        const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);

        const total = await Payment.countDocuments({});
        const removedCount = await Payment.countDocuments({ removed: true });
        const activeCount = await Payment.countDocuments({ removed: false });

        console.log('--- Payment Stats ---');
        console.log(`Total Records: ${total}`);
        console.log(`Removed: ${removedCount}`);
        console.log(`Active (shown in list): ${activeCount}`);

        const latest = await Payment.find({}).sort({ created: -1 }).limit(5);
        console.log('\n--- Latest 5 Records ---');
        latest.forEach(p => {
            console.log(`ID: ${p._id}, Date: ${p.date}, Amount: ${p.amount}, Number: ${p.number}, Removed: ${p.removed}`);
        });

        const oldest = await Payment.find({}).sort({ created: 1 }).limit(5);
        console.log('\n--- Oldest 5 Records ---');
        oldest.forEach(p => {
            console.log(`ID: ${p._id}, Date: ${p.date}, Amount: ${p.amount}, Number: ${p.number}, Removed: ${p.removed}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
