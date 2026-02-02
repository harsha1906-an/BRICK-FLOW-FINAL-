
require('mongoose');
const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";

async function listDatabases() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const adminDb = client.db().admin();
        const result = await adminDb.listDatabases();
        console.log("Databases:");
        result.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

listDatabases();
