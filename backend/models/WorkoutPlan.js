const mongoose = require('mongoose');

const workoutPlanSchema = mongoose.Schema({
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: [true, 'Please add a title for the workout plan']
    },
    description: {
        type: String,
    },
    targetMuscleGroup: {
        type: String,
        required: [true, 'Please specify target muscle group (e.g., Chest, Legs, Full Body)'],
        default: 'General'
    },
    exercises: [{
        name: {
            type: String,
            required: true
        },
        sets: {
            type: Number,
            required: true
        },
        reps: {
            type: String, // String to allow ranges like "8-12"
            required: true
        },
        notes: {
            type: String
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
