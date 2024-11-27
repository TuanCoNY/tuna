const express = require("express");
const router = express.Router()
const userController = require('../controllers/UserController');
const { authMiddleware, authUserMiddleware } = require("../middleware/authMiddleware");
//
const { sendVerificationCode } = require('../services/UserService'); // Đường dẫn tới file service


router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.post('/log-out', userController.logoutUser)
router.put('/update-user/:id', authUserMiddleware, userController.updateUser)
router.delete('/delete-user/:id', authMiddleware, userController.deleteUser)
router.get('/getAll', authMiddleware, userController.getAllUser)
router.get('/get-details/:id', authUserMiddleware, userController.getDetailsUser)
router.post('/refresh-token', userController.refreshToken)
router.post('/delete-many', authMiddleware, userController.deleteMany)
router.post('/forgot-password', userController.resetPasswordController);

// POST /api/auth/send-code
router.post('/send-code', userController.sendCodeController);
router.post('/verify-code', userController.verifyCodeController);
//
router.put('/update-role/:id', authMiddleware, userController.updateUserRole);

//
module.exports = router