const express = require('express');
const router = express.Router();
const { 
  createDelivery, 
  getDeliveries, 
  getDeliveryById, 
  updateDelivery, 
  cancelDelivery,
  trackDelivery
} = require('../controllers/deliveryController');
const auth = require('../middleware/auth');

// @route   POST api/deliveries
// @desc    Create a new delivery
// @access  Private
router.post('/', auth, createDelivery);

// @route   GET api/deliveries
// @desc    Get all user deliveries
// @access  Private
router.get('/', auth, getDeliveries);

// @route   GET api/deliveries/:id
// @desc    Get delivery by ID
// @access  Private
router.get('/:id', auth, getDeliveryById);

// @route   PUT api/deliveries/:id
// @desc    Update delivery
// @access  Private
router.put('/:id', auth, updateDelivery);

// @route   PUT api/deliveries/:id/cancel
// @desc    Cancel delivery
// @access  Private
router.put('/:id/cancel', auth, cancelDelivery);

// @route   GET api/deliveries/track/:trackingNumber
// @desc    Track delivery by tracking number
// @access  Public
router.get('/track/:trackingNumber', trackDelivery);

module.exports = router;