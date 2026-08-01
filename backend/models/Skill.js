const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a skill title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  focusArea: {
    type: String,
    required: [true, 'Please provide a core focus area'],
    trim: true,
    maxlength: [100, 'Core focus area cannot be more than 100 characters']
  },
  experience: {
    type: String,
    trim: true,
    maxlength: [100, 'Experience cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
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

skillSchema.index({ createdBy: 1, order: 1 });

module.exports = mongoose.model('Skill', skillSchema);
