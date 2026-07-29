const Section = require('../models/Section');
const Item = require('../models/Item');
const Category = require('../models/Category');
const File = require('../models/File');

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get counts for each entity
    const sectionsCount = await Section.countDocuments({ createdBy: userId });
    const itemsCount = await Item.countDocuments({ createdBy: userId });
    const categoriesCount = await Category.countDocuments({ createdBy: userId });
    const filesCount = await File.countDocuments({ uploadedBy: userId });

    // Get recent items (last 5)
    const recentItems = await Item.find({ createdBy: userId })
      .populate('section', 'name')
      .populate('category', 'name color')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get active sections count
    const activeSectionsCount = await Section.countDocuments({ 
      createdBy: userId,
      isActive: true 
    });

    // Get featured items count
    const featuredItemsCount = await Item.countDocuments({ 
      createdBy: userId,
      featured: true 
    });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          sections: sectionsCount,
          items: itemsCount,
          categories: categoriesCount,
          files: filesCount,
          activeSections: activeSectionsCount,
          featuredItems: featuredItemsCount
        },
        recentItems
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

module.exports = {
  getStats
};
