const SupportMessage = require('../models/SupportMessage');

// Automated generic knowledge base responses
const AUTOMATED_FAQS = [
  {
    keywords: ['how to lodge', 'how to submit', 'report complaint', 'new complaint', 'lodge issue'],
    question: 'How do I submit a campus facility complaint?',
    answer:
      'To lodge a complaint:\n1. Sign in with your verified student account.\n2. Click "Submit Complaint" from your dashboard navigation.\n3. Choose your facility category (Classroom, Wi-Fi, Electricity, Washroom, etc.), describe the problem, and attach clear photo evidence.\n4. Click "Submit Grievance" — our campus maintenance teams will be dispatched immediately.',
  },
  {
    keywords: ['time', 'duration', 'how long', 'hours', 'tat', 'turnaround', 'delay'],
    question: 'How long does grievance resolution take?',
    answer:
      'Resolution Timelines:\n• Emergency Issues (power outages, water leakages, lab hazards): Dispatched within 2 to 4 hours.\n• General Maintenance (classroom desks, Wi-Fi router resets, lighting): Inspected and resolved within 24 to 48 hours.',
  },
  {
    keywords: ['password', 'forgot password', 'reset password', 'change password', 'credentials'],
    question: 'How do I reset or change my password?',
    answer:
      'To reset your password:\n1. Visit /forgot-password or click "Forgot Password" on the sign-in screen.\n2. Enter your registered email or phone number to receive a 6-digit OTP.\n3. Enter the OTP and your new 8+ character strong password (must have uppercase, lowercase, number, and symbol).\nIf you are already logged in, you can update your password directly in "My Profile".',
  },
  {
    keywords: ['emergency', 'urgent', 'hotline', 'phone', 'contact number', 'helpline', 'fire', 'danger'],
    question: 'Campus Facility Emergency Helplines',
    answer:
      'For immediate safety or urgent facility hazards:\n• Campus Operations Control Desk: +1 (555) 019-CARE\n• Electrical Substation Dispatch: Ext. 104\n• Campus Security Hotline: Ext. 101\n• Plumbing & Sanitation Desk: Ext. 108',
  },
  {
    keywords: ['profile', 'dp', 'photo', 'picture', 'avatar', 'edit profile'],
    question: 'How do I update my profile picture (DP) and details?',
    answer:
      'Go to "My Profile" in your student workspace (/student/profile). You can upload a high-resolution profile picture (DP), update your contact number, faculty department, and campus residence/bio.',
  },
  {
    keywords: ['track', 'status', 'check complaint', 'my complaints', 'pending', 'resolved'],
    question: 'How do I track my submitted complaints?',
    answer:
      'Navigate to "My Complaints" (/student/complaints). You will see real-time color badges (Pending, In Progress, Resolved) and the official remarks written by campus technicians upon resolution.',
  },
];

// Purge chat messages older than 24 hours to automatically save database storage space
const purgeExpiredMessages = async () => {
  try {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    await SupportMessage.deleteMany({ createdAt: { $lt: cutoff } });
  } catch (err) {
    console.error('[Purge Support Messages Error]:', err.message);
  }
};

// @desc    Get chat messages for a session
// @route   GET /api/support/messages
// @access  Private (Registered Members Only)
const getMessages = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Only registered members can access Help & Services.',
      });
    }

    // Proactively clean up messages older than 24 hours
    await purgeExpiredMessages();

    const { sessionId } = req.query;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const messages = await SupportMessage.find({
      sessionId: String(sessionId).trim(),
      createdAt: { $gte: cutoff },
    })
      .sort({ createdAt: 1 })
      .limit(150);

    res.json({
      success: true,
      messages,
      faqs: AUTOMATED_FAQS.map((f) => ({ question: f.question, answer: f.answer })),
    });
  } catch (error) {
    console.error('[Get Support Messages Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving messages',
    });
  }
};

// @desc    Send message from registered student / user
// @route   POST /api/support/message
// @access  Private (Registered Members Only)
const sendMessage = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Only registered members can use Help & Services. Please sign in.',
      });
    }

    // Proactively clean up messages older than 24 hours
    await purgeExpiredMessages();

    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message content are required',
      });
    }

    const cleanMsg = String(message).trim();
    if (!cleanMsg) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    // 1. Save registered user's message
    const userMsg = await SupportMessage.create({
      sessionId: String(sessionId).trim(),
      user: req.user._id,
      senderName: req.user.name,
      senderEmail: req.user.email,
      senderRole: req.user.role === 'admin' ? 'admin' : 'student',
      message: cleanMsg,
      isAdminReply: req.user.role === 'admin',
      isRead: false,
    });

    // 2. Check if automated smart bot reply matches any keyword
    let botReply = null;
    const lower = cleanMsg.toLowerCase();
    const matchedFaq = AUTOMATED_FAQS.find((faq) =>
      faq.keywords.some((kw) => lower.includes(kw))
    );

    if (matchedFaq) {
      botReply = await SupportMessage.create({
        sessionId: String(sessionId).trim(),
        user: null,
        senderName: 'CampusCare Assistant 🤖',
        senderEmail: 'support@campuscare.edu',
        senderRole: 'bot',
        message: `💡 **Automated Instant Answer:**\n\n${matchedFaq.answer}\n\n*If you still need direct help, our campus administration team has also been notified and will reply here.*`,
        isAdminReply: true,
        isRead: true,
      });
    } else {
      // Check if session has any prior automated greeting
      const priorCount = await SupportMessage.countDocuments({
        sessionId: String(sessionId).trim(),
      });

      if (priorCount <= 1) {
        botReply = await SupportMessage.create({
          sessionId: String(sessionId).trim(),
          user: null,
          senderName: 'CampusCare Assistant 🤖',
          senderEmail: 'support@campuscare.edu',
          senderRole: 'bot',
          message:
            '👋 Hello! Thank you for contacting CampusCare Support. We have logged your inquiry and dispatched an alert to our administration desk.\n\nWhile you wait, feel free to click any of the **Instant Answers** above for quick solutions to frequent questions.',
          isAdminReply: true,
          isRead: true,
        });
      }
    }

    res.status(201).json({
      success: true,
      userMessage: userMsg,
      botReply,
    });
  } catch (error) {
    console.error('[Send Support Message Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error sending support message',
    });
  }
};

// @desc    Get all active support conversation threads for Admin
// @route   GET /api/support/admin/threads
// @access  Private (Admin Only)
const getAdminThreads = async (req, res) => {
  try {
    await purgeExpiredMessages();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Aggregate distinct sessions with their latest message and unread count within 24h
    const sessions = await SupportMessage.aggregate([
      {
        $match: {
          createdAt: { $gte: cutoff },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $first: '$message' },
          lastMessageDate: { $first: '$createdAt' },
          lastSenderName: { $first: '$senderName' },
          lastSenderRole: { $first: '$senderRole' },
          senderEmail: { $first: '$senderEmail' },
          userId: { $first: '$user' },
          totalMessages: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$isAdminReply', false] },
                    { $eq: ['$isRead', false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
      {
        $limit: 100,
      },
    ]);

    res.json({
      success: true,
      threads: sessions,
    });
  } catch (error) {
    console.error('[Get Admin Support Threads Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving support threads',
    });
  }
};

// @desc    Admin replies to a student / user thread
// @route   POST /api/support/admin/reply
// @access  Private (Admin Only)
const adminReply = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Session ID and message content are required',
      });
    }

    const cleanMsg = String(message).trim();
    if (!cleanMsg) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    const reply = await SupportMessage.create({
      sessionId: String(sessionId).trim(),
      user: req.user._id,
      senderName: `${req.user.name} (Admin)`,
      senderEmail: req.user.email,
      senderRole: 'admin',
      message: cleanMsg,
      isAdminReply: true,
      isRead: true,
    });

    // Mark student messages in this thread as read
    await SupportMessage.updateMany(
      { sessionId: String(sessionId).trim(), isAdminReply: false },
      { $set: { isRead: true } }
    );

    res.status(201).json({
      success: true,
      message: 'Reply delivered successfully',
      reply,
    });
  } catch (error) {
    console.error('[Admin Support Reply Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error delivering admin reply',
    });
  }
};

// @desc    Mark thread as read
// @route   PUT /api/support/admin/read/:sessionId
// @access  Private (Admin Only)
const markThreadRead = async (req, res) => {
  try {
    const { sessionId } = req.params;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }

    await SupportMessage.updateMany(
      { sessionId: String(sessionId).trim(), isAdminReply: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: 'Thread marked as read' });
  } catch (error) {
    console.error('[Mark Thread Read Error]:', error);
    res.status(500).json({ success: false, message: 'Server error marking thread as read' });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getAdminThreads,
  adminReply,
  markThreadRead,
  AUTOMATED_FAQS,
};
