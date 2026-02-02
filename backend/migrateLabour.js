require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Labour = require('./src/modules/LabourModule/labour.model');
const Company = require('./src/models/appModels/Company');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        const company = await Company.findOne({ isActive: true });
        if (!company) {
            console.log('No active company found!');
            return;
        }
        console.log(`Using Default Company: ${company.name} (${company._id})`);

        const result = await Labour.updateMany(
            {},
            {
                $set: { isActive: true },
                $setOnInsert: { dailyWage: 0 } // Ensure wage exists too
            }
        );

        // Also fix missing companyIds if any
        const fixCompany = await Labour.updateMany(
            { companyId: { $exists: false } },
            { $set: { companyId: company._id } }
        );

        console.log(`Migration Complete:`);
        console.log(` - Set isActive:true for ${result.modifiedCount} docs`);
        console.log(` - Fixed companyId for ${fixCompany.modifiedCount} docs`);

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
};

migrate();
