const express = require('express');
const { body, validationResult } = require('express-validator');
const { updateProfile, changePassword } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware for profile update
const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty')
    .isLength({ max: 50 }).withMessage('Name cannot be more than 50 characters'),
  body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('Email cannot be empty')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation middleware for password change
const validatePasswordChange = [
  body('currentPassword')
    .trim()
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .trim()
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];

// All profile routes require authentication
router.put('/', protect, validateProfileUpdate, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);

module.exports = router;
