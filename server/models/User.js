const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    trim: true
  },
  dateOfBirth: {
    type: Date
  },
  targetCountry: {
    type: String,
    enum: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Other'],
    default: 'USA'
  },
  testResults: [{
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'TestResult' },
    section: {
      type: String,
      enum: ['listening', 'reading', 'writing', 'speaking']
    },
    score: Number,
    maxScore: Number,
    date: { type: Date, default: Date.now }
  }],
  purchasedCourses: [{
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    purchaseDate: { type: Date, default: Date.now },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    completedVideos: [String]
  }],
  subscription: {
    type: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    expiryDate: Date,
    paymentHistory: [{
      amount: Number,
      currency: { type: String, default: 'BDT' },
      paymentMethod: String,
      transactionId: String,
      date: { type: Date, default: Date.now }
    }]
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'bn'],
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('User', userSchema);