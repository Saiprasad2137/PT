const mongoose = require('mongoose');
require('dotenv').config();

const WorkoutPlan = require('./models/WorkoutPlan');
const User = require('./models/User');

const seedYoga = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Find a trainer
        const trainer = await User.findOne({ role: 'trainer' });

        if (!trainer) {
            console.log('No trainer found. Cannot seed plans.');
            process.exit(1);
        }

        console.log(`Seeding plans for Trainer: ${trainer.name} (${trainer._id})`);

        const yogaPlans = [
            {
                trainer: trainer._id,
                title: 'Morning Yoga Flow',
                targetMuscleGroup: 'Yoga',
                description: 'A gentle partial flow to wake up the body.',
                exercises: [
                    { name: 'Sun Salutation A', sets: 3, reps: '1 flow', notes: 'Breathe deeply' },
                    { name: 'Downward Dog', sets: 3, reps: '30 sec', notes: 'Hold and stretch' },
                    { name: 'Warrior II', sets: 2, reps: '30 sec/side', notes: 'Keep knee over ankle' }
                ]
            },
            {
                trainer: trainer._id,
                title: 'Advanced Asanas',
                targetMuscleGroup: 'Yoga (Asanas)',
                description: 'Challenging poses for flexibility and balance.',
                exercises: [
                    { name: 'Crow Pose (Bakasana)', sets: 3, reps: '20 sec', notes: 'Balance on hands' },
                    { name: 'Wheel Pose (Chakrasana)', sets: 2, reps: '15 sec', notes: 'Open chest' },
                    { name: 'Headstand', sets: 1, reps: 'Max hold', notes: 'Use wall if needed' }
                ]
            },
            {
                trainer: trainer._id,
                title: 'Acrobatics Basics',
                targetMuscleGroup: 'Acrobatics',
                description: 'Introduction to dynamic movement and tumbling.',
                exercises: [
                    { name: 'Forward Roll', sets: 5, reps: '1', notes: 'Tuck chin' },
                    { name: 'Handstand Kick-ups', sets: 3, reps: '5', notes: 'Keep arms straight' },
                    { name: 'Cartwheel', sets: 3, reps: '5/side', notes: 'Straight legs' }
                ]
            }
        ];

        await WorkoutPlan.insertMany(yogaPlans);
        console.log('Successfully seeded 3 Yoga/Acrobatics plans!');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedYoga();
