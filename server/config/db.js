const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuscare');
    console.log(`[MongoDB Connected]: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    console.error('Make sure your MongoDB server is running or your Atlas MONGODB_URI is configured in server/.env');
    // We don't exit process immediately so server can still serve informative health check
  }
};

module.exports = connectDB;
