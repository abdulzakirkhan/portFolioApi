const Item = require('../models/Item');

// @desc    Get all items for logged in user
// @route   GET /api/items
// @access  Private
const getItems = async (req, res) => {
  try {
    const { section, category } = req.query;
    
    const query = { createdBy: req.user.id };
    
    if (section) query.section = section;
    if (category) query.category = category;

    const items = await Item.find(query)
      .populate('section', 'name title')
      .populate('category', 'name color')
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching items:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
const getItem = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    })
      .populate('section', 'name title')
      .populate('category', 'name color');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching item:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
  try {
    const item = await Item.create({
      ...req.body,
      createdBy: req.user.id
    });

    const populatedItem = await Item.findById(item._id)
      .populate('section', 'name title')
      .populate('category', 'name color');

    res.status(201).json({
      success: true,
      data: populatedItem
    });
  } catch (error) {
    console.error('Error creating item:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res) => {
  try {
    let item = await Item.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('section', 'name title')
      .populate('category', 'name color');

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error updating item:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem
};
