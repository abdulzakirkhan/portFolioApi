const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateItem = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('section')
    .notEmpty().withMessage('Section is required')
    .isMongoId().withMessage('Section must be a valid MongoDB ID'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  body('category')
    .optional()
    .isMongoId().withMessage('Category must be a valid MongoDB ID'),
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
  .get(protect, getItems)
  .post(protect, validateItem, createItem);

router.route('/:id')
  .get(protect, getItem)
  .put(protect, validateItem, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
