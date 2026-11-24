const mongoose = require('mongoose');

const supportMessageSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderEmail: {
      type: String,
      default: '',
      trim: true,
    },
    senderRole: {
      type: String,
      enum: ['student', 'admin', 'guest', 'bot'],
      default: 'guest',
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    isAdminReply: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast conversation retrieval
supportMessageSchema.index({ sessionId: 1, createdAt: 1 });

module.exports = mongoose.model('SupportMessage', supportMessageSchema);
