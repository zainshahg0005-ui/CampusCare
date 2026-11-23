require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const setupAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not set in environment!');
    }

    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas successfully.');

    const targetEmail = process.env.ADMIN_EMAIL;
    const targetPassword = process.env.ADMIN_PASSWORD;

    if (!targetEmail || !targetPassword) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be defined in your environment.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(targetPassword, salt);

    // 1. Remove/demote all current admins that are NOT targetEmail
    const demoteResult = await User.updateMany(
      { role: 'admin', email: { $ne: targetEmail.toLowerCase().trim() } },
      { $set: { role: 'student' } }
    );
    console.log(`Demoted ${demoteResult.modifiedCount} previous admin(s) to student role.`);

    // 2. Add or update target administrator
    let adminUser = await User.findOne({ email: targetEmail.toLowerCase().trim() });
    if (adminUser) {
      adminUser.role = 'admin';
      adminUser.password = hashedPassword;
      adminUser.isVerified = true;
      if (!adminUser.name) adminUser.name = process.env.ADMIN_NAME || 'Campus Administrator';
      await adminUser.save();
      console.log(`Updated existing user (${targetEmail}) to admin with new credentials.`);
    } else {
      adminUser = await User.create({
        name: process.env.ADMIN_NAME || 'Campus Administrator',
        studentId: process.env.ADMIN_ID || 'ADMIN01',
        email: targetEmail.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });
      console.log(`Created new administrator account: ${targetEmail}`);
    }

    // 3. Verify admin list
    const currentAdmins = await User.find({ role: 'admin' }).select('name email studentId role');
    console.log('\n--- ACTIVE ADMINISTRATORS IN DATABASE ---');
    console.table(currentAdmins.map(a => ({
      name: a.name,
      email: a.email,
      studentId: a.studentId,
      role: a.role
    })));

    // 4. Test password match
    const passwordValid = await adminUser.matchPassword(targetPassword);
    console.log(`Password verification test for ${targetEmail}: ${passwordValid ? 'PASSED (Match)' : 'FAILED'}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  } catch (err) {
    console.error('Error updating admin:', err.message);
    process.exit(1);
  }
};

setupAdmin();
