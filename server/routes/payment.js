const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const Course = require('../models/Course');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Initialize payment with bKash/SSLCommerz
router.post('/start-payment', auth, async (req, res) => {
  try {
    const { courseId, amount, currency = 'BDT', paymentMethod = 'bkash' } = req.body;

    // Verify course exists and get price
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user already purchased
    const user = await User.findById(req.user._id);
    const alreadyPurchased = user.purchasedCourses.some(
      pc => pc.courseId.toString() === courseId
    );

    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Verify amount matches course price
    const expectedAmount = course.discountPrice || course.price.amount;
    if (amount !== expectedAmount) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    // Generate transaction ID
    const transactionId = crypto.randomUUID();

    // For demo purposes, we'll simulate payment gateway integration
    // In production, integrate with actual bKash or SSLCommerz APIs
    
    if (paymentMethod === 'bkash') {
      // bKash integration simulation
      const bkashPayment = {
        paymentID: transactionId,
        amount: amount,
        currency: currency,
        intent: 'sale',
        merchantInvoiceNumber: `INV-${Date.now()}`,
        callbackURL: `${process.env.FRONTEND_URL}/payment/callback`,
        successCallbackURL: `${process.env.FRONTEND_URL}/payment/success`,
        failureCallbackURL: `${process.env.FRONTEND_URL}/payment/failure`,
        cancelledCallbackURL: `${process.env.FRONTEND_URL}/payment/cancelled`
      };

      res.json({
        message: 'Payment initiated successfully',
        paymentData: bkashPayment,
        paymentUrl: `https://sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create`, // Demo URL
        transactionId
      });
    } else if (paymentMethod === 'sslcommerz') {
      // SSLCommerz integration simulation
      const sslcommerzPayment = {
        store_id: process.env.SSLCOMMERZ_STORE_ID || 'demo_store',
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD || 'demo_pass',
        total_amount: amount,
        currency: currency,
        tran_id: transactionId,
        success_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz-success`,
        fail_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz-fail`,
        cancel_url: `${process.env.BACKEND_URL}/api/payment/sslcommerz-cancel`,
        cus_name: `${user.firstName} ${user.lastName}`,
        cus_email: user.email,
        cus_phone: user.phone || '01700000000',
        cus_add1: 'Dhaka, Bangladesh',
        cus_city: 'Dhaka',
        cus_country: 'Bangladesh',
        product_name: course.title,
        product_category: course.category,
        product_profile: 'digital-goods'
      };

      res.json({
        message: 'Payment initiated successfully',
        paymentData: sslcommerzPayment,
        paymentUrl: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php', // Demo URL
        transactionId
      });
    } else {
      res.status(400).json({ message: 'Unsupported payment method' });
    }
  } catch (error) {
    console.error('Start payment error:', error);
    res.status(500).json({ message: 'Error initiating payment' });
  }
});

// Verify payment and complete purchase
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { transactionId, courseId, paymentData } = req.body;

    // In production, verify payment with actual gateway APIs
    // For demo, we'll simulate successful verification
    const isPaymentValid = true; // Replace with actual verification logic

    if (!isPaymentValid) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Get course and user
    const course = await Course.findById(courseId);
    const user = await User.findById(req.user._id);

    if (!course || !user) {
      return res.status(404).json({ message: 'Course or user not found' });
    }

    // Check if already purchased (prevent double purchase)
    const alreadyPurchased = user.purchasedCourses.some(
      pc => pc.courseId.toString() === courseId
    );

    if (alreadyPurchased) {
      return res.status(400).json({ message: 'Course already purchased' });
    }

    // Add course to user's purchased courses
    user.purchasedCourses.push({
      courseId: course._id,
      purchaseDate: new Date(),
      progress: 0,
      completedVideos: []
    });

    // Add payment to user's history
    user.subscription.paymentHistory.push({
      amount: paymentData.amount || course.price.amount,
      currency: paymentData.currency || 'BDT',
      paymentMethod: paymentData.paymentMethod || 'bkash',
      transactionId: transactionId,
      date: new Date()
    });

    await user.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.json({
      message: 'Payment verified and course purchased successfully',
      course: {
        id: course._id,
        title: course.title,
        purchaseDate: new Date()
      }
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Error verifying payment' });
  }
});

// SSLCommerz success callback
router.post('/sslcommerz-success', async (req, res) => {
  try {
    const { tran_id, amount, currency, status } = req.body;

    if (status === 'VALID') {
      // Payment successful - redirect to frontend with success status
      res.redirect(`${process.env.FRONTEND_URL}/payment/success?transaction=${tran_id}`);
    } else {
      res.redirect(`${process.env.FRONTEND_URL}/payment/failure?transaction=${tran_id}`);
    }
  } catch (error) {
    console.error('SSLCommerz success callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
});

// SSLCommerz failure callback
router.post('/sslcommerz-fail', async (req, res) => {
  try {
    const { tran_id } = req.body;
    res.redirect(`${process.env.FRONTEND_URL}/payment/failure?transaction=${tran_id}`);
  } catch (error) {
    console.error('SSLCommerz failure callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment/error`);
  }
});

// Get payment history
router.get('/history', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('purchasedCourses.courseId', 'title thumbnail category');

    const paymentHistory = user.subscription.paymentHistory.map(payment => ({
      ...payment.toObject(),
      course: user.purchasedCourses.find(pc => 
        pc.purchaseDate.getTime() === payment.date.getTime()
      )?.courseId
    }));

    res.json({
      paymentHistory: paymentHistory.reverse(), // Most recent first
      totalSpent: paymentHistory.reduce((sum, payment) => sum + payment.amount, 0)
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

module.exports = router;