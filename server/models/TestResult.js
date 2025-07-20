const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  section: {
    type: String,
    enum: ['listening', 'reading', 'writing', 'speaking'],
    required: true
  },
  testType: {
    type: String,
    enum: ['practice', 'mock', 'full-test'],
    default: 'practice'
  },
  questions: [{
    questionId: String,
    question: String,
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number, // in seconds
    aiAnalysis: {
      feedback: String,
      strengths: [String],
      improvements: [String],
      score: Number
    }
  }],
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 9
  },
  bandScore: {
    type: Number,
    min: 0,
    max: 9
  },
  detailedScores: {
    taskAchievement: Number, // for writing
    coherenceCohesion: Number, // for writing
    lexicalResource: Number,
    grammaticalRange: Number,
    fluency: Number, // for speaking
    pronunciation: Number // for speaking
  },
  timeSpent: {
    type: Number, // total time in seconds
    required: true
  },
  aiEvaluation: {
    overallFeedback: String,
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    improvementTips: [String]
  },
  audioUrl: String, // for speaking tests
  writingText: String, // for writing tests
  status: {
    type: String,
    enum: ['pending', 'evaluated', 'failed'],
    default: 'pending'
  },
  retakeCount: {
    type: Number,
    default: 0
  },
  createdAt: { type: Date, default: Date.now },
  evaluatedAt: Date
});

// Index for efficient queries
testResultSchema.index({ userId: 1, section: 1, createdAt: -1 });
testResultSchema.index({ section: 1, overallScore: -1 });

module.exports = mongoose.model('TestResult', testResultSchema);