const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation
} = require('../controllers/translationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateTranslation = [
  body('key')
    .trim()
    .notEmpty().withMessage('Key is required')
    .isLength({ max: 200 }).withMessage('Key cannot be more than 200 characters'),
  body('language')
    .trim()
    .notEmpty().withMessage('Language is required')
    .isLength({ max: 10 }).withMessage('Language cannot be more than 10 characters'),
  body('value')
    .trim()
    .notEmpty().withMessage('Value is required'),
  body('context')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Context cannot be more than 100 characters'),
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

// All routes require authentication
router.route('/')
  .get(protect, getTranslations)
  .post(protect, validateTranslation, createTranslation);

router.route('/:id')
  .get(protect, getTranslation)
  .put(protect, validateTranslation, updateTranslation)
  .delete(protect, deleteTranslation);

module.exports = router;
