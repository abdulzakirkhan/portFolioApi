const File = require('../models/File');

// @desc    Get all files for logged in user
// @route   GET /api/files
// @access  Private
const getFiles = async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { uploadedBy: req.user.id };
    
    if (category) query.category = category;

    const files = await File.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files
    });
  } catch (error) {
    console.error('Error fetching files:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single file
// @route   GET /api/files/:id
// @access  Private
const getFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Upload new file (metadata only, actual upload handled separately)
// @route   POST /api/files
// @access  Private
const createFile = async (req, res) => {
  try {
    const file = await File.create({
      ...req.body,
      uploadedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error creating file:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update file metadata
// @route   PUT /api/files/:id
// @access  Private
const updateFile = async (req, res) => {
  try {
    let file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    file = await File.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error updating file:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete file
// @route   DELETE /api/files/:id
// @access  Private
const deleteFile = async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      uploadedBy: req.user.id
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    await file.deleteOne();

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getFiles,
  getFile,
  createFile,
  updateFile,
  deleteFile
};
