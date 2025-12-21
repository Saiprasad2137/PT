const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all clients
// @route   GET /api/users/clients
// @access  Private
const getClients = asyncHandler(async (req, res) => {
    // Only fetch clients assigned to this trainer
    const clients = await User.find({ role: 'client', assignedTrainer: req.user.id }).select('-password');
    res.status(200).json(clients);
});

// @desc    Get all trainers
// @route   GET /api/users/trainers
// @access  Private
const getTrainers = asyncHandler(async (req, res) => {
    // Return all verified trainers
    const trainers = await User.find({ role: 'trainer', isVerified: true }).select('-password');
    res.status(200).json(trainers);
});

// @desc    Hire a trainer
// @route   PUT /api/users/hire/:id
// @access  Private
const hireTrainer = asyncHandler(async (req, res) => {
    const trainerId = req.params.id;

    // Check if trainer exists and is verified
    const trainer = await User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer' || !trainer.isVerified) {
        res.status(404);
        throw new Error('Trainer not found or not verified');
    }

    // Assign trainer to client
    const user = await User.findById(req.user.id);
    user.assignedTrainer = trainerId;
    await user.save();

    res.status(200).json({ message: `You have successfully hired ${trainer.name}` });
});

module.exports = {
    getClients,
    getTrainers,
    hireTrainer
};
