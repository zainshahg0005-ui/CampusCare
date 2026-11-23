const rateLimit = require('express-rate-limit');

// Strict rate limiter for authentication endpoints (prevent credential stuffing & brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register requests per 15 minutes
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many login or registration attempts from this IP. Please try again after 15 minutes.',
  },
});

// Rate limiter for lodging complaints (prevent ticket flooding/spam)
const complaintSubmitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 6, // Limit each IP to 6 submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You are submitting complaints too quickly. Please pause for a moment.',
  },
});

// General global rate limiter for API endpoints (prevent DDoS / scraping)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 400, // Limit each IP to 400 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please slow down.',
  },
});

// Strict rate limiter for requesting password reset OTP (prevents email/SMS bombing)
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 OTP requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests from this IP. Please wait 15 minutes before requesting another code.',
  },
});

// Strict rate limiter for verifying OTP and resetting password (prevents brute-force)
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 verification attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification attempts. Please wait 15 minutes before trying again.',
  },
});

module.exports = {
  authLimiter,
  complaintSubmitLimiter,
  apiLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
};
