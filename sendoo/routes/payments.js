const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment, getPaymentHistory } = require('../controllers/paymentController');
const auth = require('../middleware/auth');

// @route   POST api/payments/create-payment-intent
// @desc    Create payment intent with Stripe
// @access  Private
router.post('/create-payment-intent', auth, createPaymentIntent);

// @route   POST api/payments/confirm/:deliveryId
// @desc    Confirm payment for delivery
// @access  Private
router.post('/confirm/:deliveryId', auth, confirmPayment);

// @route   GET api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', auth, getPaymentHistory);

module.exports = router;