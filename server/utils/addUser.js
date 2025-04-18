require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model'); // Adjust the path based on your project structure

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));


const addUser = async () => {
    try {
        const newUser = new User({
            username: 'john_doe',
            email: 'johndoe@example.com',
            password: 'securepassword123', // Ideally, hash this password
            avatar: ''
        });

        await newUser.save();
        console.log('✅ User Added:', newUser);
        mongoose.connection.close(); // Close connection after adding user
    } catch (error) {
        console.error('❌ Error Adding User:', error);
    }
};


// Export the function for use in other files
module.exports = addUser;
