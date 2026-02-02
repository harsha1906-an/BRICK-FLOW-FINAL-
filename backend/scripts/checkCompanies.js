require('dotenv').config();
const mongoose = require('mongoose');

async function checkCompanies() {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        // We don't have the Company model definition easily available in a single file to require,
        // so we'll access the collection directly.
        const companies = await mongoose.connection.db.collection('companies').find({}).toArray();
        console.log(`Found ${companies.length} companies:`);
        console.log(JSON.stringify(companies, null, 2));

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkCompanies();
