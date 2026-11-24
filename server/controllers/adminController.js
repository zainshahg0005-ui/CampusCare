const User = require('../models/User');
const Complaint = require('../models/Complaint');
const { sendComplaintStatusNotification } = require('../services/notificationService');

// @desc    Get admin dashboard metrics & summary
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student', isVerified: true });
    const totalComplaints = await Complaint.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressComplaints = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });
    const rejectedComplaints = await Complaint.countDocuments({ status: 'Rejected' });

    // Recent 6 complaints with student info
    const recentComplaints = await Complaint.find()
      .populate('studentId', 'name studentId email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Category distribution
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        totalStudents,
        totalComplaints,
        pendingComplaints,
        inProgressComplaints,
        resolvedComplaints,
        rejectedComplaints,
        recentComplaints,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('[Admin Dashboard Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch admin dashboard statistics',
    });
  }
};

// @desc    Get all complaints with filtering and search
// @route   GET /api/admin/complaints
// @access  Private (Admin only)
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, search } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    // If search term is provided, filter by title, location, or match student
    let complaintsQuery = Complaint.find(query).populate('studentId', 'name studentId email');

    let complaints = await complaintsQuery.sort({ createdAt: -1 });

    if (search && search.trim() !== '') {
      // Escape regex special characters to prevent ReDoS (Regular Expression Denial of Service)
      const safeSearch = search.trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      complaints = complaints.filter((c) => {
        const titleMatch = regex.test(c.title);
        const locMatch = regex.test(c.location);
        const descMatch = regex.test(c.description);
        const studentNameMatch = c.studentId && regex.test(c.studentId.name);
        const studentIdMatch = c.studentId && regex.test(c.studentId.studentId);
        return titleMatch || locMatch || descMatch || studentNameMatch || studentIdMatch;
      });
    }

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error('[Admin Get Complaints Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints list',
    });
  }
};

// @desc    Update complaint status and add admin response
// @route   PUT /api/admin/complaints/:id/status
// @access  Private (Admin only)
const updateComplaintStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Allowed values: Pending, In Progress, Resolved, Rejected',
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (status) complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse.trim();

    const updatedComplaint = await complaint.save();
    const populated = await Complaint.findById(updatedComplaint._id).populate(
      'studentId',
      'name studentId email phone'
    );

    // Trigger Email / WhatsApp notification to student (strictly awaited for serverless execution)
    if (populated && populated.studentId) {
      try {
        await sendComplaintStatusNotification({
          student: populated.studentId,
          complaint: populated,
        });
      } catch (notifyErr) {
        console.error('[Notification Dispatch Warning]:', notifyErr.message);
      }
    }

    res.json({
      success: true,
      message: `Complaint status updated to "${complaint.status}" successfully`,
      complaint: populated,
    });
  } catch (error) {
    console.error('[Update Complaint Status Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update complaint status',
    });
  }
};

// @desc    Get registered students list with complaint counts
// @route   GET /api/admin/students
// @access  Private (Admin only)
const getStudentsList = async (req, res) => {
  try {
    const { search } = req.query;

    const query = { role: 'student', isVerified: true };

    if (search && search.trim() !== '') {
      // Escape regex special characters to prevent ReDoS
      const safeSearch = search.trim().slice(0, 50).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(safeSearch, 'i');
      query.$or = [{ name: regex }, { studentId: regex }, { email: regex }];
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    // Aggregate complaints count per student
    const studentComplaints = await Complaint.aggregate([
      {
        $group: {
          _id: '$studentId',
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] },
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'Resolved'] }, 1, 0] },
          },
        },
      },
    ]);

    const complaintMap = {};
    studentComplaints.forEach((sc) => {
      complaintMap[sc._id.toString()] = {
        total: sc.total,
        pending: sc.pending,
        resolved: sc.resolved,
      };
    });

    const studentsWithCounts = students.map((student) => {
      const stats = complaintMap[student._id.toString()] || {
        total: 0,
        pending: 0,
        resolved: 0,
      };
      return {
        _id: student._id,
        name: student.name,
        studentId: student.studentId,
        email: student.email,
        createdAt: student.createdAt,
        complaintCount: stats.total,
        pendingCount: stats.pending,
        resolvedCount: stats.resolved,
      };
    });

    res.json({
      success: true,
      count: studentsWithCounts.length,
      students: studentsWithCounts,
    });
  } catch (error) {
    console.error('[Get Students Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students list',
    });
  }
};

module.exports = {
  getAdminDashboard,
  getAllComplaints,
  updateComplaintStatus,
  getStudentsList,
};
