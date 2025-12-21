const mongoose = require('mongoose');
require('dotenv').config();

const WorkoutPlan = require('./models/WorkoutPlan');

const verifyYoga = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const plans = await WorkoutPlan.find({});
        console.log(`Found ${plans.length} total plans.`);

        const yogaPlans = plans.filter(p => ['Yoga', 'Yoga (Asanas)', 'Acrobatics', 'Flexibility'].includes(p.targetMuscleGroup));

        console.log(`Found ${yogaPlans.length} Yoga/Acrobatics plans:`);
        yogaPlans.forEach(p => {
            console.log(`- Title: ${p.title} | Category: ${p.targetMuscleGroup} | Trainer: ${p.trainer}`);
        });

        if (yogaPlans.length === 0) {
            console.log('No Yoga/Acrobatics plans found in the database. Creation might be failing or none have been created yet.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyYoga();
