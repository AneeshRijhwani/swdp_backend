

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/signup', authController.signup);
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-otp', authController.verifyOTP);
router.post('/update-password', authController.updatePassword);

module.exports = router;