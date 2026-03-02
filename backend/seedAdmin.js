// backend/seedAdmin.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Color output helper
function colorize(msg, color) {
  const codes = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    reset: '\x1b[0m',
  };
  return codes[color] ? `${codes[color]}${msg}${codes.reset}` : msg;
}

// Import User model
const User = require('./src/models/userModel');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(colorize('Error: MONGO_URI environment variable not set.', 'red'));
  process.exit(1);
}

async function seedAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(colorize('Connected to MongoDB.', 'cyan'));

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(colorize('Admin user already exists. No action taken.', 'yellow'));
      await mongoose.connection.close();
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('P4ssw0rd@admin', 10);
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });
    await adminUser.save();
    console.log(colorize('Default admin user created successfully!', 'green'));
    console.log(colorize('Email: admin@gmail.com', 'blue'));
    console.log(colorize('Password: P4ssw0rd@admin', 'blue'));
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(colorize('Error seeding admin user:', 'red'), error);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  }
}

seedAdmin();
