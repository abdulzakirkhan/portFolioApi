const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} = require('../controllers/achievementController');

const router = express.Router();

const validateAchievement = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('category')
    .optional()
    .isIn(['Technical', 'Professional']).withMessage('Category must be Technical or Professional'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Company cannot be more than 200 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Location cannot be more than 100 characters'),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date'),
  body('bullets')
    .optional()
    .custom(value => {
      if (typeof value === 'string') {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error('Bullets must be an array');
        if (parsed.some(text => typeof text !== 'string')) throw new Error('Bullets must be an array of strings');
      } else if (!Array.isArray(value)) {
        throw new Error('Bullets must be an array');
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
  .get(protect, getAllAchievements)
  .post(protect, validateAchievement, createAchievement);

router.route('/:id')
  .get(protect, getAchievementById)
  .put(protect, validateAchievement, updateAchievement)
  .delete(protect, deleteAchievement);

module.exports = router;
