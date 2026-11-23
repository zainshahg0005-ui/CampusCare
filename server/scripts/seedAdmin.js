require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuscare';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Campus Administrator';
    const adminStudentId = process.env.ADMIN_ID || 'ADMIN01';

    if (!adminEmail || !adminPassword) {
      throw new Error('Missing required environment variables: ADMIN_EMAIL and ADMIN_PASSWORD must be configured.');
    }

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail.trim().toLowerCase() });

    if (existing) {
      console.log(`Admin account (${adminEmail}) already exists.`);
      if (existing.role !== 'admin') {
        existing.role = 'admin';
        await existing.save();
        console.log(`Updated role of ${adminEmail} to admin.`);
      }
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: adminName.trim(),
        studentId: adminStudentId.trim().toUpperCase(),
        email: adminEmail.trim().toLowerCase(),
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });

      console.log('--------------------------------------------------');
      console.log('✅ Admin account provisioned successfully!');
      console.log(`Email:    ${adminEmail}`);
      console.log(`Admin ID: ${adminStudentId}`);
      console.log('Role:     admin');
      console.log('--------------------------------------------------');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin account:', error.message);
    process.exit(1);
  }
};

seedAdmin();
