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

    const targetEmail = 'zainshahg0005@gmail.com';
    const targetPassword = '@Zain@2665.';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(targetPassword, salt);

    // 1. Remove/demote all current admins that are NOT zainshahg0005@gmail.com
    const demoteResult = await User.updateMany(
      { role: 'admin', email: { $ne: targetEmail } },
      { $set: { role: 'student' } }
    );
    console.log(`Demoted ${demoteResult.modifiedCount} previous admin(s) to student role.`);

    // Also delete the default seed admin 'admin@campuscare.edu' completely
    const deleteResult = await User.deleteOne({ email: 'admin@campuscare.edu' });
    if (deleteResult.deletedCount > 0) {
      console.log('Removed default seed admin (admin@campuscare.edu).');
    }

    // 2. Add or update zainshahg0005@gmail.com as the sole admin
    let zainUser = await User.findOne({ email: targetEmail });
    if (zainUser) {
      zainUser.role = 'admin';
      zainUser.password = hashedPassword;
      if (!zainUser.name) zainUser.name = 'Zain Shah';
      await zainUser.save();
      console.log(`Updated existing user (${targetEmail}) to admin with new password.`);
    } else {
      zainUser = await User.create({
        name: 'Zain Shah',
        studentId: 'ADMIN01',
        email: targetEmail,
        password: hashedPassword,
        role: 'admin',
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
    const passwordValid = await zainUser.matchPassword(targetPassword);
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
