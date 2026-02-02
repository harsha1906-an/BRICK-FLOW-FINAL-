const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

async function run() {
    try {
        await mongoose.connect(process.env.DATABASE);
        const paymentSchema = new mongoose.Schema({}, { strict: false, collection: 'payments' });
        const Payment = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
        const records = await Payment.find({}).sort({ created: -1 });
        console.log('PAY_COUNT:' + records.length);
        records.forEach(r => {
            console.log('PAY_ITEM:' + JSON.stringify({
                id: r._id,
                num: r.number,
                date: r.date,
                created: r.created,
                removed: r.removed,
                code: r.transactionCode
            }));
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
run();
