const { MongoClient } = require('mongodb');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

async function run() {
    const url = process.env.DATABASE.split('"').join('').trim();
    const dbName = url.split('/').pop().split('?')[0];
    const client = new MongoClient(url);

    let output = '';
    const log = (msg) => { output += msg + '\n'; console.log(msg); };

    try {
        await client.connect();
        log('Connected to: ' + url);
        const db = client.db(dbName);
        const collections = ['payments', 'invoices', 'clients', 'bookings', 'settings'];

        for (const name of collections) {
            try {
                const count = await db.collection(name).countDocuments({});
                const removed = await db.collection(name).countDocuments({ removed: true });
                const exists = await db.collection(name).countDocuments({ removed: { $exists: false } });
                log(`Collection: ${name} | Total: ${count} | Removed: ${removed} | Missing Removed Field: ${exists}`);
            } catch (e) {
                log(`Collection: ${name} | Error: ${e.message}`);
            }
        }

        const latest = await db.collection('payments').find({}).sort({ created: -1 }).limit(10).toArray();
        log('\n--- Latest Payments ---');
        latest.forEach(p => {
            log(JSON.stringify({ id: p._id, number: p.number, date: p.date, removed: p.removed, created: p.created }));
        });

        fs.writeFileSync('db_report.txt', output);
        process.exit(0);
    } catch (err) {
        fs.writeFileSync('db_error.txt', err.stack);
        process.exit(1);
    } finally {
        await client.close();
    }
}

run();
