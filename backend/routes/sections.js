const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection
} = require('../controllers/sectionController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateSection = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot be more than 100 characters'),
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters'),
  body('order')
    .optional()
    .isNumeric().withMessage('Order must be a number'),
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
  .get(protect, getSections)
  .post(protect, validateSection, createSection);

router.route('/:id')
  .get(protect, getSection)
  .put(protect, validateSection, updateSection)
  .delete(protect, deleteSection);

module.exports = router;
