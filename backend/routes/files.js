const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateFile = [
  body('filename')
    .trim()
    .notEmpty().withMessage('Filename is required'),
  body('originalName')
    .trim()
    .notEmpty().withMessage('Original name is required'),
  body('mimetype')
    .trim()
    .notEmpty().withMessage('Mimetype is required'),
  body('size')
    .isNumeric().withMessage('Size must be a number'),
  body('path')
    .trim()
    .notEmpty().withMessage('Path is required'),
  body('category')
    .optional()
    .isIn(['image', 'document', 'video', 'audio', 'other']).withMessage('Invalid category'),
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
  .get(protect, getFiles)
  .post(protect, validateFile, createFile);

router.route('/:id')
  .get(protect, getFile)
  .put(protect, validateFile, updateFile)
  .delete(protect, deleteFile);

module.exports = router;
