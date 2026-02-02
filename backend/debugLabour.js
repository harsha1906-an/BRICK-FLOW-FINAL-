require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Labour = require('./src/modules/LabourModule/labour.model');
const Company = require('./src/models/appModels/Company');

const debug = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        const companies = await Company.find({});
        console.log(`Companies found: ${companies.length}`);
        companies.forEach(c => console.log(` - ${c.name} (${c._id}) Active: ${c.isActive}`));

        const labours = await Labour.find({});
        console.log(`\nLabour documents found: ${labours.length}`);
        labours.forEach(l => {
            console.log(` - Name: ${l.name}, Active: ${l.isActive}, CompanyId: ${l.companyId}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
};

debug();
