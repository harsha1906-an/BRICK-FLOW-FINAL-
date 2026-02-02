require('dotenv').config();
const mongoose = require('mongoose');

async function checkCollections() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        const labour = await mongoose.connection.db.collection('laboures').find({}).toArray(); // Try plural? or 'labour'
        console.log(`Found ${labour.length} entries in 'laboures'`);

        // Also try 'labour'
        const labour2 = await mongoose.connection.db.collection('labour').find({}).toArray();
        console.log(`Found ${labour2.length} entries in 'labour'`);

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCollections();
