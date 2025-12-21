const express = require('express');
const router = express.Router();
const { createPlan, getPlans, logWorkout, getLogs, getStats } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/stats', protect, getStats);
router.route('/').post(protect, createPlan).get(protect, getPlans);
router.route('/log').post(protect, logWorkout).get(protect, getLogs);

module.exports = router;
