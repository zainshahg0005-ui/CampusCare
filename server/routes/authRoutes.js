const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyRegistrationOtp,
  resendRegistrationOtp,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
  authLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require('../middleware/rateLimitMiddleware');

// Protected against brute-force and credential stuffing
router.post('/register', authLimiter, registerUser);
router.post('/verify-registration-otp', authLimiter, verifyRegistrationOtp);
router.post('/resend-registration-otp', forgotPasswordLimiter, resendRegistrationOtp);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getCurrentUser);

// Password Reset endpoints with strict rate limiting
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

module.exports = router;
