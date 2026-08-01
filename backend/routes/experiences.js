const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const experienceUpload = require('../config/experienceUpload');
const {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
} = require('../controllers/experienceController');

const router = express.Router();

const validateExperience = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required')
    .isLength({ max: 200 }).withMessage('Company cannot be more than 200 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot be more than 100 characters'),
  body('startDate')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date'),
  body('endDate')
    .optional({ checkFalsy: true })
    .isISO8601().withMessage('End date must be a valid date'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  body('technologies')
    .optional()
    .custom(value => {
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error('Technologies must be an array');
        if (parsed.some(tag => typeof tag !== 'string')) throw new Error('Technologies must be an array of strings');
      } else if (!Array.isArray(value)) {
        throw new Error('Technologies must be an array');
      }
      return true;
    }),
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

router.route('/')
  .get(protect, getAllExperiences)
  .post(protect, experienceUpload.single('logo'), validateExperience, createExperience);

router.route('/:id')
  .get(protect, getExperienceById)
  .put(protect, experienceUpload.single('logo'), validateExperience, updateExperience)
  .delete(protect, deleteExperience);

module.exports = router;
