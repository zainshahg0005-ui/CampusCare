const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllComplaints,
  updateComplaintStatus,
  getStudentsList,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require valid login and admin role
router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getAdminDashboard);
router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);
router.get('/students', getStudentsList);

module.exports = router;
