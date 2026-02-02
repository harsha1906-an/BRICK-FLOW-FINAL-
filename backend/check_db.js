
require('dotenv').config();
const mongoose = require('mongoose');

// Connect to DB (will wait for connection)
mongoose.connect(process.env.DATABASE || "mongodb://localhost:27017/brickflow_erp")
    .then(() => console.log('Connected to DB'))
    .catch(err => console.error('DB Connection Error:', err));

async function checkUsers() {
    try {
        const Admin = require('./src/models/coreModels/Admin');
        const users = await Admin.find({});
        console.log('--- Registered Users ---');
        if (users.length === 0) {
            console.log('No users found in database.');
        } else {
            users.forEach(user => {
                console.log(`Email: ${user.email}, Name: ${user.name} ${user.surname}, Role: ${user.role}, Enabled: ${user.enabled}`);
            });
        }
        console.log('------------------------');
        process.exit();
    } catch (error) {
        console.error('Error querying users:', error);
        process.exit(1);
    }
}

// Give it a moment to connect then run
setTimeout(checkUsers, 1000);
