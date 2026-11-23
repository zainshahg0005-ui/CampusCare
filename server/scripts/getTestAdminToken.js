require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        studentId: 'SYSADMIN01',
        email: 'sysadmin@campuscare.internal',
        password: 'disabled-login-placeholder',
        role: 'admin',
        isVerified: true,
      });
    }
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET || 'campuscare_super_secret_jwt_key_2026',
      { expiresIn: '1h' }
    );
    console.log(token);
    process.exit(0);
  } catch (err) {
    console.error('[Admin Token Helper Error]:', err.message);
    process.exit(1);
  }
})();
