require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campuscare';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    const adminEmail = process.env.ADMIN_EMAIL || 'zainshahg0005@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '@Zain@2665.';
    const adminName = 'Zain Shah';
    const adminStudentId = 'ADMIN01';

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });

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
        name: adminName,
        studentId: adminStudentId,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });

      console.log('--------------------------------------------------');
      console.log('✅ Admin account created successfully!');
      console.log(`Email:    ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
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
