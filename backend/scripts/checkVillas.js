require('dotenv').config();
const mongoose = require('mongoose');
const Villa = require('../src/modules/VillaModule/villa.model');

async function checkVillas() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        const villas = await Villa.find({});
        console.log('Total Villas:', villas.length);
        console.log('Villas:', JSON.stringify(villas, null, 2));

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkVillas();
