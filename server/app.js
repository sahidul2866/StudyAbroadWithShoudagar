// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// === Middleware ===
app.use(helmet());                        // Security headers
app.use(compression());                  // Gzip compression
app.use(morgan('combined'));             // Logging

// Rate limiting middleware
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                  // Max 100 requests per IP
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// === MongoDB Connection ===
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://sahidul2866:LXNRGYtcWolXjFpj@sahidul.panszqz.mongodb.net';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit on DB connection failure
  });

// === Routes ===
const authRoutes = require('./routes/auth');
const ieltsRoutes = require('./routes/ielts');
const coursesRoutes = require('./routes/courses');
const documentsRoutes = require('./routes/documents');
const materialsRoutes = require('./routes/materials');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/ielts', ieltsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/documents', documentsRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// === Health Check ===
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});
app.get('/', (req, res) => {
  res.send('API is running. Use /api/... routes.');
});

// === 404 Handler ===
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
