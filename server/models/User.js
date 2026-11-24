const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide full name'],
    trim: true,
  },
  studentId: {
    type: String,
    required: [true, 'Please provide student ID'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  phone: {
    type: String,
    trim: true,
  },
  avatar: {
    type: String,
    default: '',
  },
  department: {
    type: String,
    default: '',
    trim: true,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
  },
  resetPasswordOtp: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  verificationOtp: {
    type: String,
    default: null,
  },
  verificationOtpExpires: {
    type: Date,
    default: null,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
  unverifiedExpiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Helper method to verify passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Automatic TTL cleanup for abandoned unverified registrations (30 minutes)
userSchema.index({ unverifiedExpiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('User', userSchema);
