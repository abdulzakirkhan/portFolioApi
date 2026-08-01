const mongoose = require('mongoose');

const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. Please check MongoDB connection.'
    });
  }
  next();
};

module.exports = { checkDbConnection };
