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
  updateProfile,
  updateAvatar,
  removeAvatar,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  authLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require('../middleware/rateLimitMiddleware');

// Protected against brute-force and credential stuffing
router.post('/register', authLimiter, registerUser);
router.post('/send-registration-otp', forgotPasswordLimiter, resendRegistrationOtp);
router.post('/verify-registration-otp', authLimiter, verifyRegistrationOtp);
router.post('/resend-registration-otp', forgotPasswordLimiter, resendRegistrationOtp);
router.post('/login', authLimiter, loginUser);
router.get('/me', protect, getCurrentUser);

// Student Profile Management & DP Uploads
router.put('/profile', protect, updateProfile);
router.post('/profile/avatar', protect, upload.single('avatar'), updateAvatar);
router.delete('/profile/avatar', protect, removeAvatar);

// Password Reset endpoints with strict rate limiting
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', resetPasswordLimiter, resetPassword);

module.exports = router;
