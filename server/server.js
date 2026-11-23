const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root & Health check endpoints
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'CampusCare – Student Complaint Management System Backend API',
    frontendUrl: 'http://localhost:5173',
    message: 'Backend API is running! Open http://localhost:5173 in your browser to view the website.',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'CampusCare – Student Complaint Management System',
    timestamp: new Date().toISOString(),
  });
});

// Fallback route for 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 CampusCare Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
});
