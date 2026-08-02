const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an achievement title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    enum: ['Technical', 'Professional'],
    default: 'Technical'
  },
  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company cannot be more than 200 characters'],
    default: null
  },
  location: {
    type: String,
    trim: true,
    maxlength: [100, 'Location cannot be more than 100 characters'],
    default: null
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date']
  },
  bullets: {
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

achievementSchema.index({ createdBy: 1, order: 1, date: -1 });

module.exports = mongoose.model('Achievement', achievementSchema);
