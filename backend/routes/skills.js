const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

const router = express.Router();

const validateSkill = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('focusArea')
    .trim()
    .notEmpty().withMessage('Core focus area is required')
    .isLength({ max: 100 }).withMessage('Core focus area cannot be more than 100 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Experience cannot be more than 100 characters'),
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

router.route('/')
  .get(protect, getSkills)
  .post(protect, validateSkill, createSkill);

router.route('/:id')
  .get(protect, getSkill)
  .put(protect, validateSkill, updateSkill)
  .delete(protect, deleteSkill);

module.exports = router;
