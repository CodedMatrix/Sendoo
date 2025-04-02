const { v4: uuidv4 } = require('uuid');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Generate tracking number
const generateTrackingNumber = () => {
  return 'SD-' + Math.floor(100000 + Math.random() * 900000) + '-' + Date.now().toString().slice(-4);
};

// Calculate delivery price
const calculatePrice = (packageType, weight, vehicleType) => {
  let basePrice = 0;
  
  // Base price by package type
  switch (packageType) {
    case 'Small':
      basePrice = 10;
      break;
    case 'Medium':
      basePrice = 20;
      break;
    case 'Large':
      basePrice = 35;
      break;
    case 'Extra Large':
      basePrice = 50;
      break;
    default:
      basePrice = 15;
  }
  
  // Add weight factor
  const weightFactor = Math.max(1, weight / 5);
  
  // Add vehicle factor
  let vehicleFactor = 1;
  switch (vehicleType) {
    case 'Bicycle':
      vehicleFactor = 0.8;
      break;
    case 'Motorcycle':
      vehicleFactor = 1;
      break;
    case 'Car':
      vehicleFactor = 1.2;
      break;
    case 'Van':
      vehicleFactor = 1.5;
      break;
    case 'Truck':
      vehicleFactor = 2;
      break;
    default:
      vehicleFactor = 1;
  }
  
  return Math.round((basePrice * weightFactor * vehicleFactor) * 100) / 100;
};

// @desc    Create a new delivery
// @route   POST /api/deliveries
// @access  Private
exports.createDelivery = async (req, res) => {
  const {
    packageType,
    weight,
    dimensions,
    pickupAddress,
    deliveryAddress,
    recipientName,
    recipientPhone,
    recipientEmail,
    vehicleType,
    notes
  } = req.body;

  try {
    // Calculate price
    const price = calculatePrice(packageType, weight, vehicleType);
    
    // Generate tracking number
    const trackingNumber = generateTrackingNumber();
    
    // Calculate estimated delivery time (24 hours from now)
    const estimatedDeliveryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    // Create new delivery
    const delivery = new Delivery({
      user: req.user.id,
      packageType,
      weight,
      dimensions,
      pickupAddress,
      deliveryAddress,
      recipientName,
      recipientPhone,
      recipientEmail,
      vehicleType,
      price,
      trackingNumber,
      estimatedDeliveryTime,
      notes
    });
    
    await delivery.save();
    
    // Get user details for email
    const user = await User.findById(req.user.id);
    
    // Send confirmation email to user
    const userMessage = `
      <h1>Delivery Request Confirmed</h1>
      <p>Thank you for choosing Sendoo for your delivery needs.</p>
      <h2>Delivery Details:</h2>
      <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p><strong>Package Type:</strong> ${packageType}</p>
      <p><strong>Recipient:</strong> ${recipientName}</p>
      <p><strong>Estimated Delivery:</strong> ${estimatedDeliveryTime.toDateString()}</p>
      <p><strong>Price:</strong> $${price}</p>
      <p>You can track your delivery using the tracking number above.</p>
    `;
    
    await sendEmail({
      to: user.email,
      subject: 'Sendoo - Delivery Confirmation',
      html: userMessage
    });
    
    // Send notification to recipient if email provided
    if (recipientEmail) {
      const recipientMessage = `
        <h1>Package On The Way!</h1>
        <p>${user.firstName} ${user.lastName} has sent you a package via Sendoo.</p>
        <h2>Delivery Details:</h2>
        <p><strong>Tracking Number:</strong> ${trackingNumber}</p>
        <p><strong>Package Type:</strong> ${packageType}</p>
        <p><strong>Estimated Delivery:</strong> ${estimatedDeliveryTime.toDateString()}</p>
        <p>You can track your delivery using the tracking number above.</p>
      `;
      
      await sendEmail({
        to: recipientEmail,
        subject: 'Sendoo - Package On The Way',
        html: recipientMessage
      });
    }
    
    res.status(201).json(delivery);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all user deliveries
// @route   GET /api/deliveries
// @access  Private
exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get delivery by ID
// @route   GET /api/deliveries/:id
// @access  Private
exports.getDeliveryById = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if delivery belongs to user
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// @desc    Update delivery
// @route   PUT /api/deliveries/:id
// @access  Private
exports.updateDelivery = async (req, res) => {
  const {
    packageType,
    weight,
    dimensions,
    pickupAddress,
    deliveryAddress,
    recipientName,
    recipientPhone,
    recipientEmail,
    vehicleType,
    notes
  } = req.body;

  try {
    let delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if delivery belongs to user
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if delivery can be updated (only if pending)
    if (delivery.status !== 'Pending') {
      return res.status(400).json({ msg: 'Delivery cannot be updated once confirmed' });
    }
    
    // Update fields
    if (packageType) delivery.packageType = packageType;
    if (weight) delivery.weight = weight;
    if (dimensions) delivery.dimensions = dimensions;
    if (pickupAddress) delivery.pickupAddress = pickupAddress;
    if (deliveryAddress) delivery.deliveryAddress = deliveryAddress;
    if (recipientName) delivery.recipientName = recipientName;
    if (recipientPhone) delivery.recipientPhone = recipientPhone;
    if (recipientEmail) delivery.recipientEmail = recipientEmail;
    if (vehicleType) delivery.vehicleType = vehicleType;
    if (notes) delivery.notes = notes;
    
    // Recalculate price if necessary
    if (packageType || weight || vehicleType) {
      delivery.price = calculatePrice(
        delivery.packageType,
        delivery.weight,
        delivery.vehicleType
      );
    }
    
    delivery.updatedAt = Date.now();
    
    await delivery.save();
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// @desc    Cancel delivery
// @route   PUT /api/deliveries/:id/cancel
// @access  Private
exports.cancelDelivery = async (req, res) => {
  try {
    let delivery = await Delivery.findById(req.params.id);
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Check if delivery belongs to user
    if (delivery.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Check if delivery can be cancelled (only if pending or confirmed)
    if (!['Pending', 'Confirmed'].includes(delivery.status)) {
      return res.status(400).json({ msg: 'Delivery cannot be cancelled once in transit' });
    }
    
    // Update status
    delivery.status = 'Cancelled';
    delivery.updatedAt = Date.now();
    
    await delivery.save();
    
    // Get user details for email
    const user = await User.findById(req.user.id);
    
    // Send cancellation email
    const message = `
      <h1>Delivery Cancelled</h1>
      <p>Your delivery with tracking number ${delivery.trackingNumber} has been cancelled.</p>
      <p>If you paid for this delivery, a refund will be processed within 3-5 business days.</p>
    `;
    
    await sendEmail({
      to: user.email,
      subject: 'Sendoo - Delivery Cancellation',
      html: message
    });
    
    res.json(delivery);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// @desc    Track delivery by tracking number
// @route   GET /api/deliveries/track/:trackingNumber
// @access  Public
exports.trackDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ trackingNumber: req.params.trackingNumber });
    
    if (!delivery) {
      return res.status(404).json({ msg: 'Delivery not found' });
    }
    
    // Return limited information for public tracking
    const trackingInfo = {
      trackingNumber: delivery.trackingNumber,
      status: delivery.status,
      estimatedDeliveryTime: delivery.estimatedDeliveryTime,
      packageType: delivery.packageType,
      createdAt: delivery.createdAt,
      updatedAt: delivery.updatedAt
    };
    
    res.json(trackingInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};