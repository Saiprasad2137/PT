const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const approveTrainers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const result = await User.updateMany(
            { role: 'trainer' },
            { $set: { isVerified: true } }
        );

        console.log(`Updated verification for ${result.modifiedCount} trainers.`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

approveTrainers();
