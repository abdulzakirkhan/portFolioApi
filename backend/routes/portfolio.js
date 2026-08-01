const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middleware/auth');
const portfolioUpload = require('../config/portfolioUpload');
const {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');

const router = express.Router();

const validatePortfolio = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ max: 200 }).withMessage('Title cannot be more than 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot be more than 2000 characters'),
  body('projectUrl')
    .optional({ checkFalsy: true })
    .isURL().withMessage('Project URL must be a valid URL'),
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
  .get(protect, getAllPortfolios)
  .post(protect, portfolioUpload.single('image'), validatePortfolio, createPortfolio);

router.route('/:id')
  .get(protect, getPortfolioById)
  .put(protect, portfolioUpload.single('image'), validatePortfolio, updatePortfolio)
  .delete(protect, deletePortfolio);

module.exports = router;
