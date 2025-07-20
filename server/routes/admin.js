const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const TestResult = require('../models/TestResult');
const Material = require('../models/Material');
const Document = require('../models/Document');
const { adminAuth } = require('../middleware/auth');
const router = express.Router();

// Dashboard statistics
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalCourses,
      totalMaterials,
      totalTestResults,
      totalDocuments,
      recentUsers,
      popularCourses,
      revenueStats
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Material.countDocuments({ isPublic: true }),
      TestResult.countDocuments(),
      Document.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email createdAt'),
      Course.find({ isActive: true }).sort({ enrollmentCount: -1 }).limit(5),
      User.aggregate([
        { $unwind: '$subscription.paymentHistory' },
        {
          $group: {
            _id: {
              year: { $year: '$subscription.paymentHistory.date' },
              month: { $month: '$subscription.paymentHistory.date' }
            },
            totalRevenue: { $sum: '$subscription.paymentHistory.amount' },
            transactionCount: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 12 }
      ])
    ]);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // IELTS performance analytics
    const ieltsAnalytics = await TestResult.aggregate([
      {
        $group: {
          _id: '$section',
          averageScore: { $avg: '$overallScore' },
          testCount: { $sum: 1 },
          maxScore: { $max: '$overallScore' },
          minScore: { $min: '$overallScore' }
        }
      }
    ]);

    res.json({
      overview: {
        totalUsers,
        totalCourses,
        totalMaterials,
        totalTestResults,
        totalDocuments
      },
      recentUsers,
      popularCourses,
      revenueStats,
      userTrends,
      ieltsAnalytics
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// User management
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, country } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) query.role = role;
    if (country) query.targetCountry = country;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update user
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { role, subscription } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, subscription },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clean up user's data
    await Promise.all([
      TestResult.deleteMany({ userId: req.params.id }),
      Document.deleteMany({ userId: req.params.id })
    ]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// Course management
router.get('/courses', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (status) query.isActive = status === 'active';

    const courses = await Course.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalCourses = await Course.countDocuments(query);

    res.json({
      courses,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCourses / limit),
        totalCourses
      }
    });
  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Test results analytics
router.get('/test-results', adminAuth, async (req, res) => {
  try {
    const { section, dateFrom, dateTo, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (section) query.section = section;
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
      if (dateTo) query.createdAt.$lte = new Date(dateTo);
    }

    const testResults = await TestResult.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalResults = await TestResult.countDocuments(query);

    // Performance analytics
    const performanceAnalytics = await TestResult.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$section',
          averageScore: { $avg: '$overallScore' },
          totalTests: { $sum: 1 },
          highestScore: { $max: '$overallScore' },
          lowestScore: { $min: '$overallScore' }
        }
      }
    ]);

    res.json({
      testResults,
      performanceAnalytics,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalResults / limit),
        totalResults
      }
    });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({ message: 'Error fetching test results' });
  }
});

// System settings
router.get('/settings', adminAuth, async (req, res) => {
  try {
    // Return system configuration
    const settings = {
      paymentGateways: {
        bkash: {
          enabled: !!process.env.BKASH_API_KEY,
          mode: process.env.BKASH_MODE || 'sandbox'
        },
        sslcommerz: {
          enabled: !!process.env.SSLCOMMERZ_STORE_ID,
          mode: process.env.SSLCOMMERZ_MODE || 'sandbox'
        }
      },
      aiIntegration: {
        gemini: {
          enabled: !!process.env.GEMINI_API_KEY,
          model: 'gemini-pro'
        }
      },
      emailService: {
        enabled: !!process.env.EMAIL_SERVICE_API_KEY,
        provider: process.env.EMAIL_PROVIDER || 'sendgrid'
      },
      subscription: {
        plans: {
          free: { price: 0, features: ['Basic IELTS practice', 'Limited materials'] },
          premium: { price: 999, features: ['All IELTS practice', 'Premium materials', 'AI evaluation'] },
          pro: { price: 1999, features: ['Everything in Premium', 'Personal mentor', 'Priority support'] }
        }
      }
    };

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// Update system settings
router.put('/settings', adminAuth, async (req, res) => {
  try {
    // In a real application, you would save these to a database
    // For demo purposes, we'll just return success
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Error updating settings' });
  }
});

module.exports = router;