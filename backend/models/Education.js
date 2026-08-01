const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Please provide an institution name'],
    trim: true,
    maxlength: [100, 'Institution name cannot be more than 100 characters']
  },
  degree: {
    type: String,
    required: [true, 'Please provide a degree'],
    trim: true,
    maxlength: [100, 'Degree cannot be more than 100 characters']
  },
  field: {
    type: String,
    required: [true, 'Please provide a field of study'],
    trim: true,
    maxlength: [100, 'Field cannot be more than 100 characters']
  },
  logo: {
    type: String,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date']
  },
  endDate: {
    type: Date,
    default: null
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
educationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Education', educationSchema);
