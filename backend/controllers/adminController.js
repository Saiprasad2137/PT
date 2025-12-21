const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all pending trainers
// @route   GET /api/admin/pending
// @access  Private/Admin
const getPendingTrainers = asyncHandler(async (req, res) => {
    const trainers = await User.find({ role: 'trainer', isVerified: false }).select('-password');
    res.status(200).json(trainers);
});

// @desc    Verify a trainer
// @route   PUT /api/admin/verify/:id
// @access  Private/Admin
const verifyTrainer = asyncHandler(async (req, res) => {
    const trainer = await User.findById(req.params.id);

    if (trainer) {
        trainer.isVerified = true;
        const updatedTrainer = await trainer.save();
        res.status(200).json(updatedTrainer);
    } else {
        res.status(404);
        throw new Error('Trainer not found');
    }
});

module.exports = {
    getPendingTrainers,
    verifyTrainer,
};
