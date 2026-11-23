const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { sendPasswordResetNotification } = require('../services/notificationService');

// Helper to generate JWT
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'campuscare_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, studentId, email, password, confirmPassword } = req.body;

    // Strict type checks against NoSQL injection
    if (
      typeof name !== 'string' ||
      typeof studentId !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format provided',
      });
    }

    // Validation
    if (!name || !studentId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Strict email format and legitimate domain validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid, properly formatted email address (e.g. name@university.edu)',
      });
    }

    const emailDomain = email.trim().toLowerCase().split('@')[1];
    const blockedDisposableDomains = [
      'tempmail.com', 'throwawaymail.com', 'mailinator.com', '10minutemail.com',
      'guerrillamail.com', 'sharklasers.com', 'trashmail.com', 'temp-mail.org',
      'yopmail.com', 'dispostable.com', 'fakeinbox.com', 'getairmail.com',
    ];
    if (blockedDisposableDomains.includes(emailDomain)) {
      return res.status(400).json({
        success: false,
        message: 'Disposable or temporary email services are not permitted. Please use your legitimate personal or university email.',
      });
    }

    // Check if email already registered
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Check if studentId already registered
    const studentIdExists = await User.findOne({
      studentId: studentId.toUpperCase(),
    });
    if (studentIdExists) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Student ID is already registered',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (Strictly enforce 'student' role for self-registration)
    const user = await User.create({
      name: name.trim(),
      studentId: studentId.trim().toUpperCase(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: 'student', // Public registrations can only be student
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to CampusCare.',
        user: {
          _id: user._id,
          name: user.name,
          studentId: user.studentId,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid user data provided',
      });
    }
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Strict type checks against NoSQL object injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid input format provided',
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // Find user by email
    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        user: {
          _id: user._id,
          name: user.name,
          studentId: user.studentId,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id, user.role),
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login',
    });
  }
};

// @desc    Get currently logged in user profile
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user',
    });
  }
};

// @desc    Request Password Reset OTP (Email or WhatsApp)
// @route   POST /api/auth/forgot-password
// @access  Public (Rate-limited)
const forgotPassword = async (req, res) => {
  try {
    const { email, method = 'email' } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid registered email address',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return ambiguous success message to prevent user enumeration attacks
      return res.json({
        success: true,
        message: 'If an account exists with this email, a verification code has been dispatched.',
      });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Dispatch via Notification Service (Email or WhatsApp)
    await sendPasswordResetNotification({
      user,
      otp,
      method,
    });

    res.json({
      success: true,
      message: `A 6-digit verification code has been sent via ${method === 'whatsapp' ? 'WhatsApp' : 'email'}.`,
    });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request',
    });
  }
};

// @desc    Verify OTP and Reset Password
// @route   POST /api/auth/reset-password
// @access  Public (Rate-limited)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, verification code, and new password',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOtp: otp.toString().trim(),
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code. Please request a new code.',
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOtp = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      success: true,
      message: 'Password successfully reset! You can now sign in with your new credentials.',
    });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resetting password',
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
