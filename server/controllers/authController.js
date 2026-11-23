const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const {
  sendPasswordResetNotification,
  sendRegistrationOtpNotification,
} = require('../services/notificationService');

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
    const { name, studentId, email, phone, password, confirmPassword, method = 'email' } = req.body;

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

    // Phone validation if WhatsApp method is selected or phone is supplied
    let cleanPhone = '';
    if (phone && typeof phone === 'string') {
      cleanPhone = phone.replace(/[^\d+]/g, '').trim();
    }

    if (method === 'whatsapp') {
      if (!cleanPhone || cleanPhone.length < 7) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid WhatsApp / Mobile number (with country code, e.g. +1 555-019-2834) to receive your code via WhatsApp.',
        });
      }
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
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser.isVerified !== false) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Check if phone already registered by another verified user
    if (cleanPhone) {
      const existingPhone = await User.findOne({
        phone: cleanPhone,
        isVerified: { $ne: false },
        _id: { $ne: existingUser?._id },
      });
      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: 'An account with this mobile/WhatsApp number already exists',
        });
      }
    }

    // Check if studentId already registered by an active verified user
    const existingStudentId = await User.findOne({
      studentId: studentId.toUpperCase(),
    });
    if (existingStudentId && existingStudentId._id.toString() !== existingUser?._id.toString() && existingStudentId.isVerified !== false) {
      return res.status(400).json({
        success: false,
        message: 'A student with this Student ID is already registered',
      });
    }

    // Generate 6-digit secure numeric verification OTP (15 min lifespan)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let user;
    if (existingUser && existingUser.isVerified === false) {
      // Update pending registration
      existingUser.name = name.trim();
      existingUser.studentId = studentId.trim().toUpperCase();
      existingUser.password = hashedPassword;
      if (cleanPhone) existingUser.phone = cleanPhone;
      existingUser.verificationOtp = otp;
      existingUser.verificationOtpExpires = otpExpires;
      user = await existingUser.save();
    } else {
      // Create new pending registration
      user = await User.create({
        name: name.trim(),
        studentId: studentId.trim().toUpperCase(),
        email: email.trim().toLowerCase(),
        phone: cleanPhone || undefined,
        password: hashedPassword,
        role: 'student',
        isVerified: false,
        verificationOtp: otp,
        verificationOtpExpires: otpExpires,
      });
    }

    // Dispatch verification OTP via chosen channel (WhatsApp or Email)
    await sendRegistrationOtpNotification({
      email: user.email,
      phone: user.phone,
      name: user.name,
      otp,
      method,
    });

    const destination = user.email;
    res.status(200).json({
      success: true,
      requiresOtp: true,
      email: user.email,
      phone: user.phone,
      method: 'email',
      message: `A 6-digit verification code has been dispatched to ${destination}.`,
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// @desc    Verify student registration OTP and activate account
// @route   POST /api/auth/verify-registration-otp
// @access  Public
const verifyRegistrationOtp = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    if ((!email && !phone) || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Account identifier and 6-digit verification code are required',
      });
    }

    const cleanOtp = String(otp).trim();
    let query = {};
    if (email) {
      query.email = email.trim().toLowerCase();
    } else if (phone) {
      query.phone = String(phone).replace(/[^\d+]/g, '').trim();
    }

    const user = await User.findOne(query);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please initiate registration.',
      });
    }

    if (user.isVerified) {
      return res.status(200).json({
        success: true,
        alreadyVerified: true,
        message: 'Your account is already verified! You can proceed to sign in.',
      });
    }

    if (!user.verificationOtp || user.verificationOtp !== cleanOtp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your code and try again.',
      });
    }

    if (!user.verificationOtpExpires || user.verificationOtpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.',
      });
    }

    // Activate account
    user.isVerified = true;
    user.verificationOtp = null;
    user.verificationOtpExpires = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account verified successfully! Welcome to CampusCare.',
      user: {
        _id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      token: generateToken(user._id, user.role),
    });
  } catch (error) {
    console.error('[Verify OTP Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error verifying registration code',
    });
  }
};

// @desc    Resend registration OTP
// @route   POST /api/auth/resend-registration-otp
// @access  Public
const resendRegistrationOtp = async (req, res) => {
  try {
    const { email, phone, method = 'email' } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: 'Email address or phone number is required',
      });
    }

    let query = {};
    if (email) query.email = email.trim().toLowerCase();
    else if (phone) query.phone = String(phone).replace(/[^\d+]/g, '').trim();

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Account not found. Please register first.',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified. Please sign in.',
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendRegistrationOtpNotification({
      email: user.email,
      phone: user.phone,
      name: user.name,
      otp,
      method,
    });

    const destination = user.email;
    res.json({
      success: true,
      message: `A fresh 6-digit verification code has been dispatched to ${destination}.`,
    });
  } catch (error) {
    console.error('[Resend OTP Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error resending verification code',
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
      if (user.isVerified === false) {
        return res.status(403).json({
          success: false,
          requiresVerification: true,
          email: user.email,
          message: 'Your account is pending verification. Please verify your email with the 6-digit OTP code.',
        });
      }

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
    const { identifier, email, phone, method = 'email' } = req.body;

    const lookupVal = identifier || (method === 'whatsapp' ? (phone || email) : (email || phone));
    if (!lookupVal || typeof lookupVal !== 'string') {
      return res.status(400).json({
        success: false,
        message: method === 'whatsapp'
          ? 'Please provide your registered WhatsApp / Mobile number or account email'
          : 'Please provide your registered account email address',
      });
    }

    const cleanInput = lookupVal.trim();
    let query = {};
    if (cleanInput.includes('@')) {
      query.email = cleanInput.toLowerCase();
    } else {
      const cleanPhone = cleanInput.replace(/[^\d+]/g, '');
      query = {
        $or: [
          { phone: cleanPhone },
          { phone: cleanInput },
          { email: cleanInput.toLowerCase() }
        ]
      };
    }

    const user = await User.findOne(query);

    if (!user) {
      // Ambiguous message to prevent account enumeration
      return res.json({
        success: true,
        message: `If an account matches this ${method === 'whatsapp' ? 'phone number' : 'email'}, a verification code has been dispatched.`,
      });
    }

    // Security check: if user requests WhatsApp OTP but has no phone on record
    if (method === 'whatsapp') {
      if (!user.phone) {
        return res.status(400).json({
          success: false,
          requiresEmail: true,
          message: 'No registered WhatsApp / Mobile number is associated with this account. Please switch to Email to receive your verification code.',
        });
      }
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

    const destination = user.email;
    res.json({
      success: true,
      method: 'email',
      destination,
      message: `A 6-digit verification code has been dispatched to ${destination}.`,
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
    const { identifier, email, phone, otp, newPassword } = req.body;

    const lookupVal = identifier || email || phone;
    if (!lookupVal || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your account identifier, verification code, and new password',
      });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanInput = lookupVal.trim();
    let queryConditions = {
      resetPasswordOtp: otp.toString().trim(),
      resetPasswordExpires: { $gt: Date.now() },
    };

    if (cleanInput.includes('@')) {
      queryConditions.email = cleanInput.toLowerCase();
    } else {
      const cleanPhone = cleanInput.replace(/[^\d+]/g, '');
      queryConditions.$or = [
        { phone: cleanPhone },
        { phone: cleanInput },
        { email: cleanInput.toLowerCase() }
      ];
    }

    const user = await User.findOne(queryConditions);

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
  verifyRegistrationOtp,
  resendRegistrationOtp,
  loginUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
};
