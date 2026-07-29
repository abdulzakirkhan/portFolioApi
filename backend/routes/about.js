const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getAboutMe,
  createAboutMe,
  updateAboutMe,
  deleteAboutMe
} = require('../controllers/aboutMeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateAboutMe = [
  body('aboutText')
    .optional()
    .trim()
    .if(body('aboutText').exists())
    .notEmpty().withMessage('About text cannot be empty')
    .isLength({ max: 5000 }).withMessage('About text cannot be more than 5000 characters'),
  body('professionalHighlights')
    .optional()
    .isArray().withMessage('Professional highlights must be an array'),
  body('professionalHighlights.*.title')
    .optional()
    .trim()
    .if(body('professionalHighlights.*.title').exists())
    .notEmpty().withMessage('Highlight title cannot be empty')
    .isLength({ max: 200 }).withMessage('Highlight title cannot be more than 200 characters'),
  body('professionalHighlights.*.description')
    .optional()
    .trim()
    .if(body('professionalHighlights.*.description').exists())
    .notEmpty().withMessage('Highlight description cannot be empty')
    .isLength({ max: 500 }).withMessage('Highlight description cannot be more than 500 characters'),
  body('developerInterests.githubContributions')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('GitHub contributions text cannot be more than 500 characters'),
  body('developerInterests.openSource')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Open source text cannot be more than 500 characters'),
  body('developerInterests.featuredProjects')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Featured projects text cannot be more than 500 characters'),
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
  .get(protect, getAboutMe)
  .post(protect, validateAboutMe, createAboutMe)
  .put(protect, validateAboutMe, updateAboutMe)
  .delete(protect, deleteAboutMe);

module.exports = router;
