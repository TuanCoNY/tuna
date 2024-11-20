const express = require('express');
const { forgotPassword, resetPassword } = require('../../controllers/authController');
const router = express.Router();

// POST: Gửi email đặt lại mật khẩu
router.post('/forgot-password', forgotPassword);

// POST: Đặt lại mật khẩu
router.post('/reset-password/:token', resetPassword);

module.exports = router;
