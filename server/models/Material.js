const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['video', 'pdf', 'article', 'vocabulary', 'grammar', 'practice-test', 'audio'],
    required: true
  },
  category: {
    type: String,
    enum: ['listening', 'reading', 'writing', 'speaking', 'vocabulary', 'grammar', 'general'],
    required: true
  },
  fileUrl: String,
  content: String, // For articles or text-based content
  thumbnail: String,
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [String],
  duration: Number, // in minutes for videos/audio
  wordCount: Number, // for articles
  downloadUrl: String,
  isPublic: {
    type: Boolean,
    default: true
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Index for efficient search and filtering
materialSchema.index({ type: 1, category: 1, difficulty: 1 });
materialSchema.index({ tags: 1 });
materialSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Material', materialSchema);