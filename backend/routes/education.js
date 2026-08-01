const express = require('express');
const { body, validationResult } = require('express-validator');
const { 
  getAllEducation, 
  getEducationById, 
  createEducation, 
  updateEducation, 
  deleteEducation 
} = require('../controllers/educationController');
const { protect } = require('../middleware/auth');
const educationUpload = require('../config/educationUpload');

const router = express.Router();

// Validation middleware
const validateEducation = [
  body('institution')
    .trim()
    .notEmpty().withMessage('Institution is required')
    .isLength({ max: 100 }).withMessage('Institution cannot be more than 100 characters'),
  body('degree')
    .trim()
    .notEmpty().withMessage('Degree is required')
    .isLength({ max: 100 }).withMessage('Degree cannot be more than 100 characters'),
  body('field')
    .trim()
    .notEmpty().withMessage('Field of study is required')
    .isLength({ max: 100 }).withMessage('Field cannot be more than 100 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),
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

// Routes
router.get('/', protect, getAllEducation);
router.get('/:id', protect, getEducationById);
router.post('/', protect, educationUpload.single('logo'), validateEducation, createEducation);
router.put('/:id', protect, educationUpload.single('logo'), validateEducation, updateEducation);
router.delete('/:id', protect, deleteEducation);

module.exports = router;
