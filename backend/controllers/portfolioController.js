const Portfolio = require('../models/Portfolio');
const fs = require('fs');
const path = require('path');

const getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ createdBy: req.user.id })
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    console.error('Error fetching portfolios:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const createPortfolio = async (req, res) => {
  try {
    const { title, description, projectUrl, technologies, order } = req.body;

    let imagePath = null;
    if (req.file) {
      imagePath = `/portfolioImages/${req.file.filename}`;
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      projectUrl,
      image: imagePath,
      technologies: technologies ? JSON.parse(technologies) : [],
      order: order || 0,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Error creating portfolio:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    let portfolio = await Portfolio.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    let imagePath = portfolio.image;
    if (req.file) {
      if (portfolio.image) {
        const oldImagePath = path.join(__dirname, '../public', portfolio.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/portfolioImages/${req.file.filename}`;
    }

    const { title, description, projectUrl, technologies, order } = req.body;

    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        projectUrl,
        image: imagePath,
        technologies: technologies ? JSON.parse(technologies) : [],
        order: order || 0
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Error updating portfolio:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio item not found'
      });
    }

    if (portfolio.image) {
      const imagePath = path.join(__dirname, '../public', portfolio.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await portfolio.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Portfolio item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting portfolio:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
};
