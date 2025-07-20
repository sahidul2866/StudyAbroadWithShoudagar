const express = require('express');
const multer = require('multer');
const path = require('path');
const Material = require('../models/Material');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/materials/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|mp4|mp3|docx|doc|pptx|ppt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only allowed file types are permitted'));
    }
  }
});

// Get all materials
router.get('/list', async (req, res) => {
  try {
    const { 
      category, 
      type, 
      difficulty, 
      isPremium, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { isPublic: true };
    
    if (category) query.category = category;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (isPremium !== undefined) query.isPremium = isPremium === 'true';
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Check if user is authenticated for premium content
    let userHasPremium = false;
    if (req.header('Authorization')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const User = require('../models/User');
        const user = await User.findById(decoded.userId);
        
        if (user && user.subscription.type !== 'free') {
          userHasPremium = true;
        }
      } catch (error) {
        // Token invalid, continue as non-premium
      }
    }

    // Filter premium content for non-premium users
    if (!userHasPremium && query.isPremium === undefined) {
      query.isPremium = false;
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const materials = await Material.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('uploadedBy', 'firstName lastName');

    const totalMaterials = await Material.countDocuments(query);

    // Filter sensitive data for non-premium users
    const filteredMaterials = materials.map(material => {
      const materialObj = material.toObject();
      if (material.isPremium && !userHasPremium) {
        delete materialObj.fileUrl;
        delete materialObj.downloadUrl;
        materialObj.previewOnly = true;
      }
      return materialObj;
    });

    res.json({
      materials: filteredMaterials,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalMaterials / limit),
        totalMaterials
      },
      filters: {
        categories: await Material.distinct('category'),
        types: await Material.distinct('type'),
        difficulties: await Material.distinct('difficulty')
      }
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Error fetching materials' });
  }
});

// Get single material
router.get('/:id', async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('uploadedBy', 'firstName lastName avatar');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check premium access
    let hasAccess = !material.isPremium;
    if (material.isPremium && req.header('Authorization')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const User = require('../models/User');
        const user = await User.findById(decoded.userId);
        
        if (user && user.subscription.type !== 'free') {
          hasAccess = true;
        }
      } catch (error) {
        // Token invalid
      }
    }

    // Increment view count
    material.viewCount += 1;
    await material.save();

    const materialData = material.toObject();
    if (!hasAccess) {
      delete materialData.fileUrl;
      delete materialData.downloadUrl;
      materialData.previewOnly = true;
    }

    res.json({ 
      material: materialData,
      hasAccess 
    });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ message: 'Error fetching material' });
  }
});

// Download material
router.get('/:id/download', auth, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // Check premium access
    if (material.isPremium && req.user.subscription.type === 'free') {
      return res.status(403).json({ message: 'Premium subscription required' });
    }

    // Increment download count
    material.downloadCount += 1;
    await material.save();

    // In production, serve file from cloud storage
    // For demo, return download URL
    res.json({
      downloadUrl: material.downloadUrl || material.fileUrl,
      filename: material.title
    });
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({ message: 'Error downloading material' });
  }
});

// Rate material
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating } = req.body;
    const materialId = req.params.id;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    // For simplicity, we'll just update the average rating
    // In production, you might want to track individual user ratings
    const newTotalRating = (material.ratings.average * material.ratings.count) + rating;
    material.ratings.count += 1;
    material.ratings.average = newTotalRating / material.ratings.count;

    await material.save();

    res.json({ 
      message: 'Rating submitted successfully',
      averageRating: material.ratings.average,
      totalRatings: material.ratings.count
    });
  } catch (error) {
    console.error('Rate material error:', error);
    res.status(500).json({ message: 'Error submitting rating' });
  }
});

// Admin: Upload new material
router.post('/admin/upload', adminAuth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      difficulty,
      isPremium,
      tags,
      content,
      duration,
      wordCount
    } = req.body;

    const materialData = {
      title,
      description,
      type,
      category,
      difficulty: difficulty || 'beginner',
      isPremium: isPremium === 'true',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      content,
      duration: duration ? parseInt(duration) : undefined,
      wordCount: wordCount ? parseInt(wordCount) : undefined,
      uploadedBy: req.user._id
    };

    if (req.file) {
      materialData.fileUrl = `/uploads/materials/${req.file.filename}`;
      materialData.downloadUrl = `/uploads/materials/${req.file.filename}`;
      
      // Generate thumbnail for video files
      if (req.file.mimetype.startsWith('video/')) {
        // In production, generate video thumbnail
        materialData.thumbnail = '/images/video-thumbnail.jpg';
      }
    }

    const material = new Material(materialData);
    await material.save();

    res.status(201).json({
      message: 'Material uploaded successfully',
      material
    });
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ message: 'Error uploading material' });
  }
});

// Admin: Update material
router.put('/admin/:id', adminAuth, async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({
      message: 'Material updated successfully',
      material
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ message: 'Error updating material' });
  }
});

// Admin: Delete material
router.delete('/admin/:id', adminAuth, async (req, res) => {
  try {
    const material = await Material.findByIdAndUpdate(
      req.params.id,
      { isPublic: false },
      { new: true }
    );

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Error deleting material' });
  }
});

// Get material statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Material.aggregate([
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          totalDownloads: { $sum: '$downloadCount' },
          byCategory: {
            $push: {
              category: '$category',
              type: '$type',
              views: '$viewCount',
              downloads: '$downloadCount'
            }
          }
        }
      }
    ]);

    const categoryStats = await Material.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);

    const typeStats = await Material.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalViews: { $sum: '$viewCount' },
          totalDownloads: { $sum: '$downloadCount' }
        }
      }
    ]);

    res.json({
      overview: stats[0] || { totalMaterials: 0, totalViews: 0, totalDownloads: 0 },
      categoryBreakdown: categoryStats,
      typeBreakdown: typeStats
    });
  } catch (error) {
    console.error('Get material stats error:', error);
    res.status(500).json({ message: 'Error fetching material statistics' });
  }
});

module.exports = router;