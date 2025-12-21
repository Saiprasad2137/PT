const mongoose = require('mongoose');
const dotenv = require('dotenv');
const WorkoutPlan = require('./models/WorkoutPlan');

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const count = await WorkoutPlan.countDocuments();
        console.log(`Total Plans: ${count}`);

        const plans = await WorkoutPlan.find({});
        console.log(JSON.stringify(plans, null, 2));

        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

verifyData();
