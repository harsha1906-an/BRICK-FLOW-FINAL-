require('dotenv').config();
const mongoose = require('mongoose');
const Villa = require('../src/modules/VillaModule/villa.model');

async function migrateVillas() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        // Update all documents that don't have the 'removed' field
        const result = await Villa.updateMany(
            { removed: { $exists: false } },
            { $set: { removed: false } }
        );

        console.log('Migrated Villas:', result);

        const villas = await Villa.find({});
        console.log('Total Villas now:', villas.length);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

migrateVillas();
