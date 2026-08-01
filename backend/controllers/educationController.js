const Education = require('../models/Education');
const fs = require('fs');
const path = require('path');

// @desc    Get all education entries
// @route   GET /api/education
// @access  Private
const getAllEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ order: 1, startDate: -1 });
    
    res.status(200).json({
      success: true,
      count: education.length,
      data: education
    });
  } catch (error) {
    console.error('Error fetching education:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching education entries'
    });
  }
};

// @desc    Get single education entry
// @route   GET /api/education/:id
// @access  Private
const getEducationById = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error('Error fetching education:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching education entry'
    });
  }
};

// @desc    Create new education entry
// @route   POST /api/education
// @access  Private
const createEducation = async (req, res) => {
  try {
    const { institution, degree, field, startDate, endDate, current, description, location, order } = req.body;
    
    // Handle logo upload
    let logoPath = null;
    if (req.file) {
      logoPath = `/educationLogos/${req.file.filename}`;
    }
    
    const education = await Education.create({
      institution,
      degree,
      field,
      logo: logoPath,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      current: current || false,
      description,
      location,
      order: order || 0
    });
    
    res.status(201).json({
      success: true,
      message: 'Education entry created successfully',
      data: education
    });
  } catch (error) {
    console.error('Error creating education:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating education entry'
    });
  }
};

// @desc    Update education entry
// @route   PUT /api/education/:id
// @access  Private
const updateEducation = async (req, res) => {
  try {
    let education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }
    
    const { institution, degree, field, startDate, endDate, current, description, location, order } = req.body;
    
    // Handle logo upload
    let logoPath = education.logo;
    if (req.file) {
      // Delete old logo if exists
      if (education.logo) {
        const oldLogoPath = path.join(__dirname, '../public', education.logo);
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }
      logoPath = `/educationLogos/${req.file.filename}`;
    }
    
    education = await Education.findByIdAndUpdate(
      req.params.id,
      {
        institution,
        degree,
        field,
        logo: logoPath,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        current: current || false,
        description,
        location,
        order: order || 0
      },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'Education entry updated successfully',
      data: education
    });
  } catch (error) {
    console.error('Error updating education:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating education entry'
    });
  }
};

// @desc    Delete education entry
// @route   DELETE /api/education/:id
// @access  Private
const deleteEducation = async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education entry not found'
      });
    }
    
    // Delete logo file if exists
    if (education.logo) {
      const logoPath = path.join(__dirname, '../public', education.logo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }
    
    await education.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Education entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting education entry'
    });
  }
};

module.exports = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation
};
