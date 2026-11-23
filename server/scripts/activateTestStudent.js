require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const connectDB = require('../config/db');
const User = require('../models/User');

const email = process.argv[2];
if (!email) {
  console.error('Email argument required');
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    await User.updateOne(
      { email: email.trim().toLowerCase() },
      { isVerified: true, verificationOtp: null, verificationOtpExpires: null }
    );
    console.log(`[Test Helper]: Activated ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('[Test Helper Error]:', err.message);
    process.exit(1);
  }
})();
