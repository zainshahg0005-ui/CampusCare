const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

// Schema for persistent serverless rate limiting with MongoDB TTL
let RateLimitModel;
const getRateLimitModel = () => {
  if (RateLimitModel) return RateLimitModel;
  if (mongoose.models.RateLimitRecord) {
    RateLimitModel = mongoose.models.RateLimitRecord;
    return RateLimitModel;
  }
  const schema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    totalHits: { type: Number, default: 1 },
    resetTime: { type: Date, required: true },
    expireAt: { type: Date, required: true },
  });
  schema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
  RateLimitModel = mongoose.model('RateLimitRecord', schema);
  return RateLimitModel;
};

// Custom MongoDB Store for express-rate-limit (persists across Vercel serverless cold starts)
class MongoRateLimitStore {
  constructor(prefix = 'rl:') {
    this.prefix = prefix;
    this.localFallback = new Map();
  }

  init(options) {
    this.windowMs = options.windowMs || 60000;
  }

  async increment(key) {
    const fullKey = `${this.prefix}${key}`;
    const now = new Date();
    const resetTime = new Date(now.getTime() + this.windowMs);

    try {
      if (mongoose.connection.readyState === 1) {
        const Model = getRateLimitModel();
        let record = await Model.findOneAndUpdate(
          { key: fullKey, expireAt: { $gt: now } },
          { $inc: { totalHits: 1 } },
          { new: true }
        );

        if (!record) {
          try {
            record = await Model.create({
              key: fullKey,
              totalHits: 1,
              resetTime,
              expireAt: resetTime,
            });
          } catch (dupErr) {
            record = await Model.findOneAndUpdate(
              { key: fullKey },
              { $inc: { totalHits: 1 } },
              { new: true }
            );
          }
        }

        return {
          totalHits: record ? record.totalHits : 1,
          resetTime: record ? record.resetTime : resetTime,
        };
      }
    } catch (err) {
      console.warn('[RateLimit Store Warning]:', err.message);
    }

    // In-memory fallback if DB not ready
    const existing = this.localFallback.get(fullKey);
    if (existing && existing.resetTime > now) {
      existing.totalHits += 1;
      return existing;
    }
    const fresh = { totalHits: 1, resetTime };
    this.localFallback.set(fullKey, fresh);
    return fresh;
  }

  async decrement(key) {
    const fullKey = `${this.prefix}${key}`;
    try {
      if (mongoose.connection.readyState === 1) {
        const Model = getRateLimitModel();
        await Model.updateOne({ key: fullKey }, { $inc: { totalHits: -1 } });
      }
    } catch (e) {}
  }

  async resetKey(key) {
    const fullKey = `${this.prefix}${key}`;
    try {
      if (mongoose.connection.readyState === 1) {
        const Model = getRateLimitModel();
        await Model.deleteOne({ key: fullKey });
      }
    } catch (e) {}
    this.localFallback.delete(fullKey);
  }
}

// Strict rate limiter for authentication endpoints (prevent credential stuffing & brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 15 login/register requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  store: new MongoRateLimitStore('auth:'),
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
  store: new MongoRateLimitStore('complaint:'),
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
  store: new MongoRateLimitStore('api:'),
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
  store: new MongoRateLimitStore('forgot:'),
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
  store: new MongoRateLimitStore('reset:'),
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
