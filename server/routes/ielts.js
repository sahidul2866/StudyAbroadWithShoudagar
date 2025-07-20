const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const TestResult = require('../models/TestResult');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key');

// Submit writing test for AI evaluation
router.post('/submit-writing', auth, async (req, res) => {
  try {
    const { task, writingText, timeSpent, taskType } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
      Evaluate this IELTS Writing ${taskType} response:
      
      Task: ${task}
      Response: ${writingText}
      Time spent: ${timeSpent} seconds
      
      Please provide:
      1. Overall band score (0-9)
      2. Detailed scores for:
         - Task Achievement/Response (0-9)
         - Coherence and Cohesion (0-9)
         - Lexical Resource (0-9)
         - Grammatical Range and Accuracy (0-9)
      3. Detailed feedback
      4. Strengths (3-5 points)
      5. Areas for improvement (3-5 points)
      6. Specific recommendations
      
      Format as JSON with this structure:
      {
        "overallScore": number,
        "detailedScores": {
          "taskAchievement": number,
          "coherenceCohesion": number,
          "lexicalResource": number,
          "grammaticalRange": number
        },
        "feedback": "string",
        "strengths": ["string"],
        "improvements": ["string"],
        "recommendations": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluation = JSON.parse(response.text());

    // Save test result
    const testResult = new TestResult({
      userId: req.user._id,
      section: 'writing',
      testType: 'practice',
      overallScore: evaluation.overallScore,
      bandScore: evaluation.overallScore,
      detailedScores: evaluation.detailedScores,
      timeSpent,
      writingText,
      aiEvaluation: {
        overallFeedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.improvements,
        recommendations: evaluation.recommendations
      },
      status: 'evaluated',
      evaluatedAt: new Date()
    });

    await testResult.save();

    // Update user's test results
    req.user.testResults.push({
      testId: testResult._id,
      section: 'writing',
      score: evaluation.overallScore,
      maxScore: 9,
      date: new Date()
    });
    await req.user.save();

    res.json({
      message: 'Writing test evaluated successfully',
      testResult: {
        id: testResult._id,
        score: evaluation.overallScore,
        detailedScores: evaluation.detailedScores,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        recommendations: evaluation.recommendations
      }
    });
  } catch (error) {
    console.error('Writing evaluation error:', error);
    res.status(500).json({ message: 'Error evaluating writing test' });
  }
});

// Submit speaking test for AI evaluation
router.post('/submit-speaking', auth, async (req, res) => {
  try {
    const { questions, responses, timeSpent, audioUrl } = req.body;
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Create prompt with questions and text responses
    const conversationText = questions.map((q, index) => 
      `Question ${index + 1}: ${q}\nResponse: ${responses[index]}`
    ).join('\n\n');
    
    const prompt = `
      Evaluate this IELTS Speaking test response:
      
      ${conversationText}
      
      Time spent: ${timeSpent} seconds
      
      Please provide:
      1. Overall band score (0-9)
      2. Detailed scores for:
         - Fluency and Coherence (0-9)
         - Lexical Resource (0-9)
         - Grammatical Range and Accuracy (0-9)
         - Pronunciation (0-9)
      3. Detailed feedback
      4. Strengths (3-5 points)
      5. Areas for improvement (3-5 points)
      6. Specific recommendations
      
      Format as JSON with this structure:
      {
        "overallScore": number,
        "detailedScores": {
          "fluency": number,
          "lexicalResource": number,
          "grammaticalRange": number,
          "pronunciation": number
        },
        "feedback": "string",
        "strengths": ["string"],
        "improvements": ["string"],
        "recommendations": ["string"]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluation = JSON.parse(response.text());

    // Save test result
    const testResult = new TestResult({
      userId: req.user._id,
      section: 'speaking',
      testType: 'practice',
      overallScore: evaluation.overallScore,
      bandScore: evaluation.overallScore,
      detailedScores: evaluation.detailedScores,
      timeSpent,
      audioUrl,
      questions: questions.map((q, index) => ({
        question: q,
        userAnswer: responses[index],
        aiAnalysis: {
          feedback: evaluation.feedback,
          score: evaluation.overallScore
        }
      })),
      aiEvaluation: {
        overallFeedback: evaluation.feedback,
        strengths: evaluation.strengths,
        weaknesses: evaluation.improvements,
        recommendations: evaluation.recommendations
      },
      status: 'evaluated',
      evaluatedAt: new Date()
    });

    await testResult.save();

    // Update user's test results
    req.user.testResults.push({
      testId: testResult._id,
      section: 'speaking',
      score: evaluation.overallScore,
      maxScore: 9,
      date: new Date()
    });
    await req.user.save();

    res.json({
      message: 'Speaking test evaluated successfully',
      testResult: {
        id: testResult._id,
        score: evaluation.overallScore,
        detailedScores: evaluation.detailedScores,
        feedback: evaluation.feedback,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        recommendations: evaluation.recommendations
      }
    });
  } catch (error) {
    console.error('Speaking evaluation error:', error);
    res.status(500).json({ message: 'Error evaluating speaking test' });
  }
});

// Get user's test results
router.get('/results', auth, async (req, res) => {
  try {
    const { section, limit = 10, page = 1 } = req.query;
    
    const query = { userId: req.user._id };
    if (section) query.section = section;
    
    const results = await TestResult.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName');

    const totalResults = await TestResult.countDocuments(query);

    res.json({
      results,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResults / limit),
        totalResults
      }
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Error fetching test results' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { section = 'overall', limit = 50 } = req.query;
    
    let matchStage = {};
    if (section !== 'overall') {
      matchStage.section = section;
    }

    const leaderboard = await TestResult.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$userId',
          bestScore: { $max: '$overallScore' },
          testCount: { $sum: 1 },
          averageScore: { $avg: '$overallScore' },
          lastTestDate: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          userId: '$_id',
          firstName: '$user.firstName',
          lastName: '$user.lastName',
          avatar: '$user.avatar',
          targetCountry: '$user.targetCountry',
          bestScore: 1,
          testCount: 1,
          averageScore: { $round: ['$averageScore', 1] },
          lastTestDate: 1
        }
      },
      { $sort: { bestScore: -1, averageScore: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Get user's performance analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const analytics = await TestResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: {
            section: '$section',
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          averageScore: { $avg: '$overallScore' },
          testCount: { $sum: 1 },
          bestScore: { $max: '$overallScore' },
          date: { $first: '$createdAt' }
        }
      },
      {
        $sort: { 'date': 1 }
      }
    ]);

    // Get section-wise performance
    const sectionPerformance = await TestResult.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$section',
          averageScore: { $avg: '$overallScore' },
          bestScore: { $max: '$overallScore' },
          testCount: { $sum: 1 },
          improvement: {
            $push: {
              score: '$overallScore',
              date: '$createdAt'
            }
          }
        }
      }
    ]);

    res.json({
      monthlyProgress: analytics,
      sectionPerformance,
      totalTests: await TestResult.countDocuments({ userId }),
      overallAverage: await TestResult.aggregate([
        { $match: { userId } },
        { $group: { _id: null, average: { $avg: '$overallScore' } } }
      ])
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

module.exports = router;