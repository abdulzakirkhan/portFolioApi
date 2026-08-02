const Achievement = require('../models/Achievement');

const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find({ createdBy: req.user.id })
      .sort({ category: 1, order: 1, date: -1 });

    res.status(200).json({
      success: true,
      count: achievements.length,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const getAchievementById = async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    res.status(200).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Error fetching achievement:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const createAchievement = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      company,
      location,
      date,
      bullets,
      order
    } = req.body;

    const achievement = await Achievement.create({
      title,
      description,
      category: category || 'Technical',
      company: company || null,
      location: location || null,
      date: date ? new Date(date) : new Date(),
      bullets: bullets ? (typeof bullets === 'string' ? JSON.parse(bullets) : bullets) : [],
      order: order || 0,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Error creating achievement:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const updateAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    const {
      title,
      description,
      category,
      company,
      location,
      date,
      bullets,
      order
    } = req.body;

    const updatedData = {
      title,
      description,
      category: category || 'Technical',
      company: company || null,
      location: location || null,
      date: date ? new Date(date) : achievement.date,
      bullets: bullets ? (typeof bullets === 'string' ? JSON.parse(bullets) : bullets) : [],
      order: order || 0
    };

    const updatedAchievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updatedAchievement
    });
  } catch (error) {
    console.error('Error updating achievement:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found'
      });
    }

    await achievement.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
};
