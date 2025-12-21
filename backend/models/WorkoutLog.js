const mongoose = require('mongoose');

const workoutLogSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    plan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutPlan'
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
        default: Date.now
    },
    duration: {
        type: Number, // in minutes
        required: [true, 'Please add duration in minutes']
    },
    exercises: [{
        name: { type: String },
        setsCompleted: { type: Number },
        isCompleted: { type: Boolean, default: false }
    }],
    notes: {
        type: String,
        required: [true, 'Please add some notes about your workout']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
