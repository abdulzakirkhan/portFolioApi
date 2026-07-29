const Section = require('../models/Section');

// @desc    Get all sections for logged in user
// @route   GET /api/sections
// @access  Private
const getSections = async (req, res) => {
  try {
    const sections = await Section.find({ createdBy: req.user.id })
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sections.length,
      data: sections
    });
  } catch (error) {
    console.error('Error fetching sections:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single section
// @route   GET /api/sections/:id
// @access  Private
const getSection = async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error fetching section:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new section
// @route   POST /api/sections
// @access  Private
const createSection = async (req, res) => {
  try {
    const section = await Section.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error creating section:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update section
// @route   PUT /api/sections/:id
// @access  Private
const updateSection = async (req, res) => {
  try {
    let section = await Section.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    section = await Section.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: section
    });
  } catch (error) {
    console.error('Error updating section:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete section
// @route   DELETE /api/sections/:id
// @access  Private
const deleteSection = async (req, res) => {
  try {
    const section = await Section.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!section) {
      return res.status(404).json({
        success: false,
        message: 'Section not found'
      });
    }

    await section.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Section deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting section:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getSections,
  getSection,
  createSection,
  updateSection,
  deleteSection
};
