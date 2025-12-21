const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const checkTrainers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const trainers = await User.find({ role: 'trainer' });
        console.log(`Found ${trainers.length} total trainers.`);

        trainers.forEach(t => {
            console.log(`- Name: ${t.name} | Verified: ${t.isVerified} | ID: ${t._id}`);
        });

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkTrainers();
