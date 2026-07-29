const AboutMe = require('../models/AboutMe');

// @desc    Get About Me data for logged in user
// @route   GET /api/about
// @access  Private
const getAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findOne({ createdBy: req.user.id });

    if (!aboutMe) {
      return res.status(200).json({
        success: true,
        data: null
      });
    }

    res.status(200).json({
      success: true,
      data: aboutMe
    });
  } catch (error) {
    console.error('Error fetching About Me:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create or Update About Me data
// @route   POST /api/about
// @access  Private
const createAboutMe = async (req, res) => {
  try {
    // Check if About Me already exists
    const existing = await AboutMe.findOne({ createdBy: req.user.id });

    if (existing) {
      // Update existing - only update provided fields
      const updateFields = {};
      if (req.body.aboutText !== undefined) {
        updateFields.aboutText = req.body.aboutText;
      }
      if (req.body.professionalHighlights !== undefined) {
        updateFields.professionalHighlights = req.body.professionalHighlights;
      }
      if (req.body.developerInterests !== undefined) {
        updateFields.developerInterests = req.body.developerInterests;
      }

      const updated = await AboutMe.findOneAndUpdate(
        { createdBy: req.user.id },
        { $set: updateFields },
        { new: true, runValidators: true }
      );

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'About Me updated successfully'
      });
    }

    // Create new with default values for missing fields
    const aboutMeData = {
      aboutText: req.body.aboutText || '',
      professionalHighlights: req.body.professionalHighlights || [],
      developerInterests: req.body.developerInterests || {
        githubContributions: '',
        openSource: '',
        featuredProjects: ''
      },
      createdBy: req.user.id
    };

    const aboutMe = await AboutMe.create(aboutMeData);

    res.status(201).json({
      success: true,
      data: aboutMe,
      message: 'About Me created successfully'
    });
  } catch (error) {
    console.error('Error creating/updating About Me:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update About Me data
// @route   PUT /api/about
// @access  Private
const updateAboutMe = async (req, res) => {
  try {
    let aboutMe = await AboutMe.findOne({ createdBy: req.user.id });

    if (!aboutMe) {
      return res.status(404).json({
        success: false,
        message: 'About Me not found. Please create it first.'
      });
    }

    // Only update fields that are provided in the request body
    const updateFields = {};
    if (req.body.aboutText !== undefined) {
      updateFields.aboutText = req.body.aboutText;
    }
    if (req.body.professionalHighlights !== undefined) {
      updateFields.professionalHighlights = req.body.professionalHighlights;
    }
    if (req.body.developerInterests !== undefined) {
      updateFields.developerInterests = req.body.developerInterests;
    }

    aboutMe = await AboutMe.findOneAndUpdate(
      { createdBy: req.user.id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: aboutMe,
      message: 'About Me updated successfully'
    });
  } catch (error) {
    console.error('Error updating About Me:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete About Me data
// @route   DELETE /api/about
// @access  Private
const deleteAboutMe = async (req, res) => {
  try {
    const aboutMe = await AboutMe.findOne({ createdBy: req.user.id });

    if (!aboutMe) {
      return res.status(404).json({
        success: false,
        message: 'About Me not found'
      });
    }

    await aboutMe.deleteOne();

    res.status(200).json({
      success: true,
      message: 'About Me deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting About Me:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getAboutMe,
  createAboutMe,
  updateAboutMe,
  deleteAboutMe
};
