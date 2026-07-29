const mongoose = require('mongoose');

const aboutMeSchema = new mongoose.Schema({
  aboutText: {
    type: String,
    required: true,
    trim: true,
    maxlength: 5000
  },
  professionalHighlights: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    icon: {
      type: String,
      default: 'fa-star'
    }
  }],
  developerInterests: {
    githubContributions: {
      type: String,
      trim: true,
      maxlength: 500
    },
    openSource: {
      type: String,
      trim: true,
      maxlength: 500
    },
    featuredProjects: {
      type: String,
      trim: true,
      maxlength: 500
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

aboutMeSchema.index({ createdBy: 1 });

module.exports = mongoose.model('AboutMe', aboutMeSchema);
