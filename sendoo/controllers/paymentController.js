const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// @desc    Create payment intent with Stripe
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  const { deliveryId } = req.body;

  try {
    // Get delivery details
    const delivery = await Delivery.findById(deliveryId);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if delivery belongs to user
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if payment is already made
    if (delivery.paymentStatus === 'Paid') {
      return res.status(400).json({ msg: 'Payment already completed for this delivery' });
    }
    
    // Get user details
    const user = await User.findById(req.user.id);
    
    // Create or retrieve Stripe customer
    let customer;
    if (!user.stripeCustomerId) {
      customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`
      });
      
      // Save Stripe customer ID to user
      user.stripeCustomerId = customer.id;
      await user.save();
    } else {
      customer = await stripe.customers.retrieve(user.stripeCustomerId);
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(delivery.price * 100), // Convert to cents
      currency: 'usd',
      customer: customer.id,
      metadata: {
        deliveryId: delivery._id.toString(),
        userId: user._id.toString(),
        trackingNumber: delivery.trackingNumber
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: delivery.price,
      deliveryId: delivery._id
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Confirm payment for delivery
// @route   POST /api/payments/confirm/:deliveryId
// @access  Private
exports.confirmPayment = async (req, res) => {
  const { paymentIntentId, paymentMethodId } = req.body;

  try {
    // Get delivery details
    const delivery = await Delivery.findById(req.params.deliveryId);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if delivery belongs to user
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ msg: 'Payment not successful' });
    }
    
    // Update delivery payment status
    delivery.paymentStatus = 'Paid';
    delivery.paymentId = paymentIntentId;
    delivery.status = 'Confirmed';
    await delivery.save();
    
    // Create payment record
    const payment = new Payment({
      user: req.user.id,
      delivery: delivery._id,
      amount: delivery.price,
      paymentMethod: paymentMethodId,
      stripePaymentId: paymentIntentId,
      stripeCustomerId: paymentIntent.customer,
      status: 'succeeded',
      receiptUrl: paymentIntent.charges.data[0]?.receipt_url
    });
    
    await payment.save();
    
    // Get user details
    const user = await User.findById(req.user.id);
    
    // Send payment confirmation email
    const message = `
      <h1>Payment Confirmation</h1>
      <p>Thank you for your payment of $${delivery.price} for delivery with tracking number ${delivery.trackingNumber}.</p>
      <p>Your delivery has been confirmed and will be processed shortly.</p>
      <p>You can track your delivery using the tracking number above.</p>
    `;
    
    await sendEmail({
      to: user.email,
      subject: 'Sendoo - Payment Confirmation',
      html: message
    });
    
    res.json({
      success: true,
      payment,
      delivery
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get payment history
// @route   GET /api/payments/history
// @access  Private
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('delivery', 'trackingNumber status packageType')
      .sort({ createdAt: -1 });
    
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};