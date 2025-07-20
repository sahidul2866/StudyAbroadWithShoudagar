const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  isPreview: {
    type: Boolean,
    default: false
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['visa-interview', 'sop-writing', 'scholarship', 'ielts-prep', 'university-application', 'general'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'BDT'
    }
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  videos: [videoSchema],
  totalDuration: {
    type: Number, // in seconds
    default: 0
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  prerequisites: [String],
  learningOutcomes: [String],
  instructor: {
    name: {
      type: String,
      required: true
    },
    bio: String,
    avatar: String,
    qualifications: [String]
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
  reviews: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Calculate total duration when videos are added/modified
courseSchema.pre('save', function(next) {
  if (this.isModified('videos')) {
    this.totalDuration = this.videos.reduce((total, video) => total + video.duration, 0);
  }
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Course', courseSchema);