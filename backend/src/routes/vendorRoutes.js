const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Register vendor - public route (no authentication required)
router.post('/register', vendorController.registerVendor);

// All other routes require authentication and vendor role
router.use(authMiddleware);
router.use(roleMiddleware('vendor'));

// Upload document
router.post('/:id/documents', upload.single('document'), vendorController.uploadDocuments);

// Delete document
router.delete('/:id/documents/:documentId', vendorController.deleteDocument);

// Get vendor profile
router.get('/profile', vendorController.getVendorProfile);

// Update vendor
router.put('/:id', vendorController.updateVendor);

module.exports = router;

