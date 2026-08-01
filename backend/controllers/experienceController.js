const Experience = require('../models/Experience');
const fs = require('fs');
const path = require('path');

// @desc    Get all experiences for logged in user
// @route   GET /api/experiences
// @access  Private
const getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ createdBy: req.user.id })
      .sort({ order: 1, startDate: -1 });

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single experience
// @route   GET /api/experiences/:id
// @access  Private
const getExperienceById = async (req, res) => {
  try {
    const experience = await Experience.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error fetching experience:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new experience
// @route   POST /api/experiences
// @access  Private
const createExperience = async (req, res) => {
  try {
    const { title, company, location, startDate, endDate, current, description, technologies, order } = req.body;

    let logoPath = null;
    if (req.file) {
      logoPath = `/experienceLogos/${req.file.filename}`;
    }

    const experience = await Experience.create({
      title,
      company,
      location,
      logo: logoPath,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      current: current === 'true' || current === true,
      description,
      technologies: technologies ? JSON.parse(technologies) : [],
      order: order || 0,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error creating experience:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experiences/:id
// @access  Private
const updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    let logoPath = experience.logo;
    if (req.file) {
      if (experience.logo) {
        const oldLogoPath = path.join(__dirname, '../public', experience.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logoPath = `/experienceLogos/${req.file.filename}`;
    }

    const { title, company, location, startDate, endDate, current, description, technologies, order } = req.body;

    experience = await Experience.findByIdAndUpdate(
      req.params.id,
      {
        title,
        company,
        location,
        logo: logoPath,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        current: current === 'true' || current === true,
        description,
        technologies: technologies ? JSON.parse(technologies) : [],
        order: order || 0
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error updating experience:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experiences/:id
// @access  Private
const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    if (experience.logo) {
      const logoPath = path.join(__dirname, '../public', experience.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting experience:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience
};
