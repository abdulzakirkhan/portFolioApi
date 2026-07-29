const mongoose = require('mongoose');

const translationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  language: {
    type: String,
    required: true,
    trim: true,
    maxlength: 10,
    default: 'en'
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  context: {
    type: String,
    trim: true,
    maxlength: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

translationSchema.index({ key: 1, language: 1 }, { unique: true });
translationSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Translation', translationSchema);
