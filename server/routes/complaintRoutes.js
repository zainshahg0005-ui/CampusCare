const express = require('express');
const router = express.Router();
const {
  getMyComplaints,
  createComplaint,
  getComplaintById,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { complaintSubmitLimiter } = require('../middleware/rateLimitMiddleware');

// All complaint routes require being logged in
router.use(protect);

router.get('/my', getMyComplaints);
router.post('/', complaintSubmitLimiter, upload.single('image'), createComplaint);
router.get('/:id', getComplaintById);

module.exports = router;
