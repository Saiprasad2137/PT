const asyncHandler = require('express-async-handler');
const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutLog = require('../models/WorkoutLog');

// @desc    Create new workout plan
// @route   POST /api/workouts
// @access  Private (Trainer only)
const createPlan = asyncHandler(async (req, res) => {
    const { title, description, exercises, targetMuscleGroup } = req.body;

    if (!title || !exercises || exercises.length === 0) {
        res.status(400);
        throw new Error('Please add a title and at least one exercise');
    }

    // Check if user is a trainer
    if (req.user.role !== 'trainer') {
        res.status(403);
        throw new Error('Only trainers can create workout plans');
    }

    const workoutPlan = await WorkoutPlan.create({
        trainer: req.user.id,
        title,
        description,
        targetMuscleGroup: targetMuscleGroup || 'General',
        exercises
    });

    res.status(201).json(workoutPlan);
});

// @desc    Get user stats (streak, etc)
// @route   GET /api/workouts/stats
// @access  Private
const getStats = asyncHandler(async (req, res) => {
    if (req.user.role === 'trainer') {
        const clientCount = await User.countDocuments({ role: 'client' }); // Simplified for now
        const planCount = await WorkoutPlan.countDocuments({ trainer: req.user.id });
        res.status(200).json({
            activeClients: clientCount, // Placeholder logic
            plansActive: planCount
        });
    } else {
        // Calculate Streak for Client
        const logs = await WorkoutLog.find({ user: req.user.id }).sort({ date: -1 });

        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (logs.length > 0) {
            let currentDate = today;

            // Check if last workout was today or yesterday to keep streak alive
            const lastLogDate = new Date(logs[0].date);
            lastLogDate.setHours(0, 0, 0, 0);

            const diffTime = Math.abs(currentDate - lastLogDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                // Streak is alive
                let matchDate = lastLogDate;
                streak = 1;

                for (let i = 1; i < logs.length; i++) {
                    const logDate = new Date(logs[i].date);
                    logDate.setHours(0, 0, 0, 0);

                    const dayDiff = (matchDate - logDate) / (1000 * 60 * 60 * 24);

                    if (dayDiff === 1) {
                        streak++;
                        matchDate = logDate;
                    } else if (dayDiff > 1) {
                        break;
                    }
                    // if dayDiff === 0 (same day), continue
                }
            }
        }

        const workoutCount = await WorkoutLog.countDocuments({ user: req.user.id });

        res.status(200).json({
            streak,
            workoutsCompleted: workoutCount
        });
    }
});

// @desc    Get all workout plans
// @route   GET /api/workouts
// @access  Private
const getPlans = asyncHandler(async (req, res) => {
    // For now, allow everyone to see all plans so trainers can see system workouts too
    const plans = await WorkoutPlan.find({});
    res.status(200).json(plans);
});

// @desc    Log a workout
// @route   POST /api/workouts/log
// @access  Private
const logWorkout = asyncHandler(async (req, res) => {
    const { date, duration, notes, plan, exercises } = req.body;

    if (!date || !duration || !notes) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const log = await WorkoutLog.create({
        user: req.user.id,
        date,
        duration,
        notes,
        plan: plan || null,
        exercises: exercises || []
    });

    res.status(201).json(log);
});

// @desc    Get workout logs
// @route   GET /api/workouts/log
// @access  Private
const getLogs = asyncHandler(async (req, res) => {
    const logs = await WorkoutLog.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(logs);
});

module.exports = {
    createPlan,
    getPlans,
    logWorkout,
    getLogs,
    getStats
};
