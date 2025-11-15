const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Get all vendors
router.get('/vendors', adminController.getAllVendors);

// Get vendor by ID
router.get('/vendors/:id', adminController.getVendorById);

// Update vendor status
router.put('/vendors/:id/status', adminController.updateVendorStatus);

// Get dashboard stats
router.get('/stats', adminController.getStats);

module.exports = router;

