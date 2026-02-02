
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to the 'erp' database
mongoose.connect("mongodb://localhost:27017/erp")
    .then(() => console.log('Connected to DB: erp'))
    .catch(err => console.error('DB Connection Error:', err));

async function checkUsers() {
    try {
        const Admin = require('./src/models/coreModels/Admin');
        const users = await Admin.find({});
        console.log('--- Registered Users in "erp" ---');
        if (users.length === 0) {
            console.log('No users found in "erp" database.');
        } else {
            users.forEach(user => {
                console.log(`Email: ${user.email}, Name: ${user.name} ${user.surname}`);
            });
        }
        console.log('---------------------------------');
        process.exit();
    } catch (error) {
        console.error('Error querying users:', error);
        process.exit(1);
    }
}

setTimeout(checkUsers, 1000);
