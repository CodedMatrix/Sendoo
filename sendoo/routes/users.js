const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, changePassword } = require('../controllers/userController');
const auth = require('../middleware/auth');

// @route   GET api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateProfile);

// @route   PUT api/users/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, changePassword);

module.exports = router;