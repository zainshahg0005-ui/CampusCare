const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getMessages,
  sendMessage,
  getAdminThreads,
  adminReply,
  markThreadRead,
} = require('../controllers/supportController');

// Public / Student endpoints
router.get('/messages', getMessages);
router.post('/message', sendMessage);

// Admin endpoints (Protected)
router.get('/admin/threads', protect, adminOnly, getAdminThreads);
router.post('/admin/reply', protect, adminOnly, adminReply);
router.put('/admin/read/:sessionId', protect, adminOnly, markThreadRead);

module.exports = router;
