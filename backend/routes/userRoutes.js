const express = require('express');
const router = express.Router();
const { getClients, getTrainers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/clients', protect, getClients);
router.get('/trainers', protect, getTrainers);
router.put('/hire/:id', protect, require('../controllers/userController').hireTrainer);

module.exports = router;
