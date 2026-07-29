const Translation = require('../models/Translation');

// @desc    Get all translations for logged in user
// @route   GET /api/translations
// @access  Private
const getTranslations = async (req, res) => {
  try {
    const { language, key } = req.query;
    
    const query = { createdBy: req.user.id };
    
    if (language) query.language = language;
    if (key) query.key = new RegExp(key, 'i');

    const translations = await Translation.find(query)
      .sort({ key: 1, language: 1 });

    res.status(200).json({
      success: true,
      count: translations.length,
      data: translations
    });
  } catch (error) {
    console.error('Error fetching translations:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single translation
// @route   GET /api/translations/:id
// @access  Private
const getTranslation = async (req, res) => {
  try {
    const translation = await Translation.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    res.status(200).json({
      success: true,
      data: translation
    });
  } catch (error) {
    console.error('Error fetching translation:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new translation
// @route   POST /api/translations
// @access  Private
const createTranslation = async (req, res) => {
  try {
    const translation = await Translation.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: translation
    });
  } catch (error) {
    console.error('Error creating translation:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Translation with this key and language already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update translation
// @route   PUT /api/translations/:id
// @access  Private
const updateTranslation = async (req, res) => {
  try {
    let translation = await Translation.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    translation = await Translation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: translation
    });
  } catch (error) {
    console.error('Error updating translation:', error.message);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Translation with this key and language already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete translation
// @route   DELETE /api/translations/:id
// @access  Private
const deleteTranslation = async (req, res) => {
  try {
    const translation = await Translation.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!translation) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    await translation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Translation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting translation:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  deleteTranslation
};
