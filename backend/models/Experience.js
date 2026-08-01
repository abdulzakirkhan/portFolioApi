const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a job title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  company: {
    type: String,
    required: [true, 'Please provide a company name'],
    trim: true,
    maxlength: [200, 'Company cannot be more than 200 characters']
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters']
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
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  technologies: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

experienceSchema.index({ createdBy: 1, order: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
