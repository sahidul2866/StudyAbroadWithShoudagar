const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sop', 'lor', 'resume', 'cover-letter', 'bank-solvency', 'scholarship-essay'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  formData: {
    type: mongoose.Schema.Types.Mixed // Store form responses used to generate document
  },
  template: {
    type: String,
    enum: ['template1', 'template2', 'template3', 'custom'],
    default: 'template1'
  },
  isAiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: String,
  targetUniversity: String,
  targetProgram: String,
  targetCountry: String,
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed'],
    default: 'draft'
  },
  version: {
    type: Number,
    default: 1
  },
  previousVersions: [{
    content: String,
    version: Number,
    createdAt: { type: Date, default: Date.now }
  }],
  sharedWith: [{
    email: String,
    role: {
      type: String,
      enum: ['reviewer', 'collaborator'],
      default: 'reviewer'
    },
    sharedAt: { type: Date, default: Date.now }
  }],
  feedback: [{
    reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: { type: Date, default: Date.now }
  }],
  downloadCount: {
    type: Number,
    default: 0
  },
  lastDownloaded: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamp on save
documentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Index for efficient queries
documentSchema.index({ userId: 1, type: 1, createdAt: -1 });

module.exports = mongoose.model('Document', documentSchema);