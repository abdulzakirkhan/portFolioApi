const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register a new user (Database Storage)
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('💾 Storing user in MongoDB database...');

    // Check if user already exists in database
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email in database'
      });
    }

    // Create user in MongoDB database
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('✅ User successfully stored in MongoDB database');

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully and stored in database',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration'
    });
  }
};

// @desc    Login user (Database Authentication)
// @route   POST /api/auth/signin
// @access  Public
const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    console.log('🔐 Authenticating user from MongoDB database...');

    // Find user in database
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password match
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    console.log('✅ User authenticated from MongoDB database');

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful from database',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login'
    });
  }
};

// @desc    Get current logged in user (Database Query)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    console.log('👤 Fetching user from MongoDB database...');

    // Find user in database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }

    console.log('✅ User fetched from MongoDB database');

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Database error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  signup,
  signin,
  getMe
};
