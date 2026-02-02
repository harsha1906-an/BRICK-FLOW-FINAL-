
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to the 'erp' database
mongoose.connect("mongodb://localhost:27017/erp")
    .then(() => console.log('Connected to DB: erp'))
    .catch(err => console.error('DB Connection Error:', err));

async function checkAdmin() {
    try {
        const Admin = require('./src/models/coreModels/Admin');
        const user = await Admin.findOne({ email: 'admin@admin.com' });

        if (user) {
            console.log(`FOUND: Email: ${user.email}, Name: ${user.name} ${user.surname}, Role: ${user.role}`);
        } else {
            console.log('NOT FOUND: admin@admin.com does not exist in this database.');
        }
        process.exit();
    } catch (error) {
        console.error('Error querying user:', error);
        process.exit(1);
    }
}

setTimeout(checkAdmin, 1000);
