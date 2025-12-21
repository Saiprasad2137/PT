const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');
const WorkoutPlan = require('./models/WorkoutPlan');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        // Clear existing plans to ensure fresh data
        await WorkoutPlan.deleteMany();

        // Find existing trainer or create one
        let trainer = await User.findOne({ email: 'admin@gym.com' });

        if (!trainer) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            trainer = await User.create({
                name: 'System Trainer',
                email: 'admin@gym.com',
                password: hashedPassword,
                role: 'trainer'
            });
            console.log('Created System Trainer');
        }

        const workouts = [
            {
                trainer: trainer._id,
                title: 'Chest & Triceps Destroyer',
                description: 'A classic push day workout focusing on pectoral development and tricep strength.',
                targetMuscleGroup: 'Chest & Triceps',
                exercises: [
                    {
                        name: 'Barbell Bench Press',
                        sets: 4,
                        reps: '8-10',
                        notes: 'Lie on bench, feet flat. Lower bar to mid-chest. Push up explosively. Keep elbows at 45 degrees.'
                    },
                    {
                        name: 'Incline Dumbbell Press',
                        sets: 3,
                        reps: '10-12',
                        notes: 'Set bench to 30 degrees. Press dumbbells up and slightly inward, but dont bang them together.'
                    },
                    {
                        name: 'Tricep Rope Pushdowns',
                        sets: 4,
                        reps: '12-15',
                        notes: 'Keep elbows pinned to your sides. Spread the rope at the bottom for maximum contraction.'
                    },
                    {
                        name: 'Chest Flyes (Machine or Dumbbell)',
                        sets: 3,
                        reps: '15',
                        notes: 'Focus on the stretch and the squeeze at the peak. Do not go too heavy.'
                    }
                ]
            },
            {
                trainer: trainer._id,
                title: 'Back & Biceps Power',
                description: 'Build a thick, wide back and peak biceps with this pull-focused routine.',
                targetMuscleGroup: 'Back & Biceps',
                exercises: [
                    {
                        name: 'Deadlifts',
                        sets: 3,
                        reps: '5-8',
                        notes: 'Keep back straight, engage core. Drive through heels. Do not round your lower back.'
                    },
                    {
                        name: 'Lat Pulldowns',
                        sets: 4,
                        reps: '10-12',
                        notes: 'Wide grip. Pull bar to upper chest. Squeeze lats at the bottom.'
                    },
                    {
                        name: 'Seated Cable Rows',
                        sets: 3,
                        reps: '10-12',
                        notes: 'Keep chest up. Pull handle to stomach. Squeeze shoulder blades together.'
                    },
                    {
                        name: 'Barbell Curls',
                        sets: 3,
                        reps: '10-12',
                        notes: 'Strict form. No swinging. Squeeze biceps at the top.'
                    }
                ]
            },
            {
                trainer: trainer._id,
                title: 'Leg Day Foundation',
                description: 'Legs feed the wolf. Complete lower body development.',
                targetMuscleGroup: 'Legs',
                exercises: [
                    {
                        name: 'Barbell Squats',
                        sets: 4,
                        reps: '6-8',
                        notes: 'Feet shoulder width. Break at hips and knees simultaneously. Go below parallel if possible.'
                    },
                    {
                        name: 'Leg Press',
                        sets: 3,
                        reps: '10-12',
                        notes: 'Do not lock out knees at the top. Lower weight until knees are near chest.'
                    },
                    {
                        name: 'Romanian Deadlifts',
                        sets: 3,
                        reps: '10-12',
                        notes: 'Hinge at hips. Slight bend in knees. Feel the stretch in hamstrings.'
                    },
                    {
                        name: 'Walking Lunges',
                        sets: 3,
                        reps: '12 per leg',
                        notes: 'Keep torso upright. smooth continuous motion. Take steps wide enough to hit glutes.'
                    }
                ]
            }
        ];

        await WorkoutPlan.insertMany(workouts);
        console.log('Workouts Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
