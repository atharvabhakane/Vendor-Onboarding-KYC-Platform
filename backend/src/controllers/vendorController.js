const Vendor = require('../models/Vendor');
const User = require('../models/User');

// Register new vendor
exports.registerVendor = async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      contactPerson,
      email,
      phone,
      address
    } = req.body;
    
    // Validate required fields
    if (!businessName || !businessType || !contactPerson || !email || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }
    
    // Check if vendor already exists with this email
    const existingVendor = await Vendor.findOne({ email: email });
    
    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: 'A vendor with this email already exists.'
      });
    }
    
    // Create new vendor without userId (will be assigned on first login)
    const vendor = await Vendor.create({
      businessName,
      businessType,
      contactPerson,
      email,
      phone,
      address,
      statusHistory: [{
        status: 'Pending',
        changedAt: Date.now(),
        comment: 'Vendor application submitted'
      }]
    });
    
    console.log(`✅ New vendor registered: ${vendor.vendorId} (${vendor.email})`);
    
    res.status(201).json({
      success: true,
      message: 'Vendor registered successfully. You can now login with your email.',
      vendor: {
        vendorId: vendor.vendorId,
        businessName: vendor.businessName,
        email: vendor.email,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('Register vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during vendor registration.'
    });
  }
};

// Upload documents
exports.uploadDocuments = async (req, res) => {
  try {
    const { id } = req.params;
    const { documentType } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded.'
      });
    }
    
    if (!documentType) {
      return res.status(400).json({
        success: false,
        message: 'Document type is required.'
      });
    }
    
    // Find vendor
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }
    
    // Check if user owns this vendor
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }
    
    // Add document to vendor
    const document = {
      documentType,
      fileName: req.file.originalname,
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: Date.now(),
      uploadedBy: req.user.id // Track who uploaded this document
    };
    
    vendor.documents.push(document);
    
    // Check if vendor was rejected and track status change
    const oldStatus = vendor.status;
    let statusChanged = false;
    
    // If vendor was rejected, change status back to Pending for re-review
    if (vendor.status === 'Rejected') {
      vendor.status = 'Pending';
      vendor.reviewedAt = null;
      vendor.reviewedBy = null;
      vendor.rejectionReason = null;
      statusChanged = true;
      
      // Add status history entry
      vendor.statusHistory.push({
        status: 'Pending',
        changedBy: req.user.id,
        changedAt: Date.now(),
        comment: 'Vendor uploaded new documents after rejection. Pending re-review.'
      });
      
      console.log(`🔄 Vendor ${vendor.vendorId} status changed: ${oldStatus} → Pending (new document uploaded)`);
    }
    
    await vendor.save();
    
    console.log(`✅ Document uploaded for vendor ${vendor.vendorId}: ${documentType}`);
    console.log(`📄 Total documents: ${vendor.documents.length}`);
    
    res.status(200).json({
      success: true,
      message: statusChanged 
        ? 'Document uploaded successfully. Your application has been resubmitted for review.'
        : 'Document uploaded successfully.',
      document,
      totalDocuments: vendor.documents.length,
      statusChanged: statusChanged,
      newStatus: vendor.status
    });
  } catch (error) {
    console.error('Upload document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during document upload.'
    });
  }
};

// Get vendor profile for logged-in vendor
exports.getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user.id })
      .populate('userId', 'name email role')
      .populate('reviewedBy', 'name email')
      .populate('statusHistory.changedBy', 'name email');
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor profile not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Get vendor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update vendor details
exports.updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Find vendor
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }
    
    // Check if user owns this vendor
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }
    
    // Update vendor
    Object.assign(vendor, updateData);
    await vendor.save();
    
    await vendor.populate('userId', 'name email role');
    
    res.status(200).json({
      success: true,
      message: 'Vendor updated successfully.',
      vendor
    });
  } catch (error) {
    console.error('Update vendor error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during update.'
    });
  }
};

// Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const { id, documentId } = req.params;
    
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }
    
    // Check if user owns this vendor
    if (vendor.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied.'
      });
    }
    
    // Remove document
    vendor.documents = vendor.documents.filter(
      doc => doc._id.toString() !== documentId
    );
    
    await vendor.save();
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully.'
    });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during document deletion.'
    });
  }
};

