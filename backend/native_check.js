const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function run() {
    const url = process.env.DATABASE.split('"').join('').trim();
    const dbName = url.split('/').pop().split('?')[0];
    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log('Connected to:', url);
        const db = client.db(dbName);
        const collections = ['payments', 'invoices', 'clients', 'bookings', 'settings'];
        const stats = {};

        for (const name of collections) {
            try {
                const count = await db.collection(name).countDocuments({});
                const removed = await db.collection(name).countDocuments({ removed: true });
                stats[name] = { total: count, removed: removed, active: count - removed };
            } catch (e) {
                stats[name] = 'Collection not found or error';
            }
        }

        console.log('STATS:' + JSON.stringify(stats));

        // Get latest 5 payments
        const latest = await db.collection('payments').find({})
            .sort({ created: -1 })
            .limit(5)
            .toArray();

        console.log('LATEST_PAYMENTS:' + JSON.stringify(latest.map(p => ({
            id: p._id,
            num: p.number,
            amt: p.amount,
            date: p.date,
            created: p.created,
            removed: p.removed
        }))));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    } finally {
        await client.close();
    }
}

run();
