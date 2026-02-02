require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Company = require('./src/models/appModels/Company');

const migrate = async () => {
    try {
        await mongoose.connect(process.env.DATABASE);
        console.log('Connected to DB');

        const result = await Company.updateMany(
            { removed: { $exists: false } },
            { $set: { removed: false } }
        );

        console.log(`Migration Complete:`);
        console.log(` - Set removed:false for ${result.modifiedCount} companies`);

    } catch (e) {
        console.error(e);
    } finally {
        mongoose.disconnect();
    }
};

migrate();
