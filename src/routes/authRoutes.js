const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
