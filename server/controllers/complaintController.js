const Complaint = require('../models/Complaint');
let cloudinary = null;
try {
  cloudinary = require('cloudinary').v2;
} catch (e) {
  // Cloudinary module fallback
}

// Configure Cloudinary if credentials are provided in environment
if (
  cloudinary &&
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Upload buffer helper for Cloudinary stream
const uploadBufferToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'campuscare_complaints',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// @desc    Get all complaints created by logged-in student
// @route   GET /api/complaints/my
// @access  Private (Student)
const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ studentId: req.user._id })
      .sort({ createdAt: -1 });

    // Calculate quick counts for dashboard
    const total = complaints.length;
    const pending = complaints.filter((c) => c.status === 'Pending').length;
    const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
    const resolved = complaints.filter((c) => c.status === 'Resolved').length;
    const rejected = complaints.filter((c) => c.status === 'Rejected').length;

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
      },
      complaints,
    });
  } catch (error) {
    console.error('[Get My Complaints Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
    });
  }
};

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
const createComplaint = async (req, res) => {
  try {
    const { title, description, category, location } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, category, and location',
      });
    }

    // Determine image URL/path if an image was uploaded (serverless safe)
    let imagePath = '';
    if (req.file) {
      if (
        cloudinary &&
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        // Stream directly to Cloudinary
        imagePath = await uploadBufferToCloudinary(req.file.buffer, req.file.mimetype);
      } else {
        // Safe in-memory data URI fallback (never touches read-only Vercel filesystem)
        imagePath = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      }
    }

    const complaint = await Complaint.create({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location.trim(),
      image: imagePath,
      status: 'Pending',
      studentId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully! An administrator will review it shortly.',
      complaint,
    });
  } catch (error) {
    console.error('[Create Complaint Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit complaint',
    });
  }
};

// @desc    Get single complaint details by ID
// @route   GET /api/complaints/:id
// @access  Private (Owner student or Admin)
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate(
      'studentId',
      'name studentId email'
    );

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Security check: If regular student, ensure they own this complaint
    if (
      req.user.role !== 'admin' &&
      complaint.studentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this complaint record',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    console.error('[Get Complaint Details Error]:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaint details',
    });
  }
};

module.exports = {
  getMyComplaints,
  createComplaint,
  getComplaintById,
};
