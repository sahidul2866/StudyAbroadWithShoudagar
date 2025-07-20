const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all courses
router.get('/all', async (req, res) => {
  try {
    const { category, level, page = 1, limit = 12, search } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const courses = await Course.find(query)
      .select('-videos.videoUrl') // Hide video URLs for non-purchased courses
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'firstName lastName');

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
    console.error('Get courses error:', error);
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('createdBy', 'firstName lastName avatar')
      .populate('reviews.userId', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has purchased the course (if authenticated)
    let hasPurchased = false;
    if (req.header('Authorization')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.userId);
        
        if (user) {
          hasPurchased = user.purchasedCourses.some(
            pc => pc.courseId.toString() === course._id.toString()
          );
        }
      } catch (error) {
        // Token invalid, continue as non-authenticated
      }
    }

    // Filter videos based on purchase status
    const courseData = course.toObject();
    if (!hasPurchased) {
      courseData.videos = course.videos.map(video => ({
        ...video,
        videoUrl: video.isPreview ? video.videoUrl : null
      }));
    }

    res.json({ 
      course: courseData,
      hasPurchased 
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Get user's purchased courses
router.get('/my/purchased', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'purchasedCourses.courseId',
        populate: {
          path: 'createdBy',
          select: 'firstName lastName'
        }
      });

    const purchasedCourses = user.purchasedCourses.map(pc => ({
      course: pc.courseId,
      progress: pc.progress,
      completedVideos: pc.completedVideos,
      purchaseDate: pc.purchaseDate
    }));

    res.json({ purchasedCourses });
  } catch (error) {
    console.error('Get purchased courses error:', error);
    res.status(500).json({ message: 'Error fetching purchased courses' });
  }
});

// Update course progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { videoId, completed } = req.body;
    const courseId = req.params.id;

    const user = await User.findById(req.user._id);
    const purchasedCourse = user.purchasedCourses.find(
      pc => pc.courseId.toString() === courseId
    );

    if (!purchasedCourse) {
      return res.status(403).json({ message: 'Course not purchased' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Update completed videos
    if (completed && !purchasedCourse.completedVideos.includes(videoId)) {
      purchasedCourse.completedVideos.push(videoId);
    } else if (!completed) {
      purchasedCourse.completedVideos = purchasedCourse.completedVideos.filter(
        id => id !== videoId
      );
    }

    // Calculate progress percentage
    const totalVideos = course.videos.length;
    const completedCount = purchasedCourse.completedVideos.length;
    purchasedCourse.progress = Math.round((completedCount / totalVideos) * 100);

    await user.save();

    res.json({
      message: 'Progress updated successfully',
      progress: purchasedCourse.progress,
      completedVideos: purchasedCourse.completedVideos
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Add course review
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const courseId = req.params.id;

    // Check if user has purchased the course
    const user = await User.findById(req.user._id);
    const hasPurchased = user.purchasedCourses.some(
      pc => pc.courseId.toString() === courseId
    );

    if (!hasPurchased) {
      return res.status(403).json({ message: 'You must purchase the course to leave a review' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already reviewed
    const existingReview = course.reviews.find(
      review => review.userId.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }

    // Add review
    course.reviews.push({
      userId: req.user._id,
      rating,
      comment,
      date: new Date()
    });

    // Update average rating
    const totalRating = course.reviews.reduce((sum, review) => sum + review.rating, 0);
    course.ratings.average = totalRating / course.reviews.length;
    course.ratings.count = course.reviews.length;

    await course.save();

    res.json({ message: 'Review added successfully' });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// Admin: Create new course
router.post('/admin/create', adminAuth, async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      createdBy: req.user._id
    };

    const course = new Course(courseData);
    await course.save();

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ message: 'Error creating course' });
  }
});

// Admin: Update course
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      message: 'Course updated successfully',
      course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ message: 'Error updating course' });
  }
});

// Admin: Delete course
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ message: 'Course deactivated successfully' });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ message: 'Error deleting course' });
  }
});

module.exports = router;