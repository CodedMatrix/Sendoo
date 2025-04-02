const mongoose = require('mongoose');

const DeliverySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  packageType: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large', 'Extra Large']
  },
  weight: {
    type: Number,
    required: true
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  recipientName: {
    type: String,
    required: true
  },
  recipientPhone: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String
  },
  vehicleType: {
    type: String,
    enum: ['Bicycle', 'Motorcycle', 'Car', 'Van', 'Truck'],
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Picked Up', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  price: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  paymentId: {
    type: String
  },
  trackingNumber: {
    type: String,
    required: true,
    unique: true
  },
  estimatedDeliveryTime: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Delivery', DeliverySchema);