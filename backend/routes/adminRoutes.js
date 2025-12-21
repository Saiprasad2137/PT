const express = require('express');
const router = express.Router();
const { getPendingTrainers, verifyTrainer } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/pending', protect, admin, getPendingTrainers);
router.put('/verify/:id', protect, admin, verifyTrainer);

module.exports = router;
