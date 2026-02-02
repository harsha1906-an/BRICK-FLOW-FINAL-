const mongoose = require('mongoose');
const path = require('path');
require('module-alias/register');
require('dotenv').config({ path: '.env' });

async function run() {
    try {
        console.log('Connecting to:', process.env.DATABASE);
        await mongoose.connect(process.env.DATABASE);

        // Load models
        require('./src/models/appModels/Payment');
        require('./src/models/appModels/Invoice');
        require('./src/models/appModels/Client');
        require('./src/models/appModels/Booking');
        require('./src/models/appModels/Setting');

        const collections = ['Payment', 'Invoice', 'Client', 'Booking', 'Setting'];
        const stats = {};

        for (const name of collections) {
            const Model = mongoose.model(name);
            stats[name] = {
                total: await Model.countDocuments({}),
                removed: await Model.countDocuments({ removed: true }),
                active: await Model.countDocuments({ removed: false })
            };
        }

        console.log('STATS:' + JSON.stringify(stats));

        const latestPayments = await mongoose.model('Payment').find({})
            .sort({ created: -1 })
            .limit(5)
            .populate('client invoice');

        console.log('LATEST_PAYMENTS:' + JSON.stringify(latestPayments.map(p => ({
            id: p._id,
            number: p.number,
            client: p.client?.name,
            amount: p.amount,
            date: p.date,
            invoice: p.invoice?.number,
            removed: p.removed
        }))));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
