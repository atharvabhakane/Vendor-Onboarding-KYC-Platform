const Vendor = require('../models/Vendor');

// Get all vendors with filters
exports.getAllVendors = async (req, res) => {
  try {
    const { status, search } = req.query;
    
    // Build query
    let query = {};
    
    if (status && status !== 'All') {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { contactPerson: { $regex: search, $options: 'i' } },
        { vendorId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const vendors = await Vendor.find(query)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('statusHistory.changedBy', 'name email')
      .sort({ submittedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    console.error('Get all vendors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching vendors.'
    });
  }
};

// Get vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await Vendor.findById(id)
      .populate('userId', 'name email role')
      .populate('reviewedBy', 'name email')
      .populate('statusHistory.changedBy', 'name email')
      .populate('documents.uploadedBy', 'name email'); // Populate who uploaded each document
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Get vendor by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
};

// Update vendor status (Approve/Reject)
exports.updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body;
    
    if (!status || !['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (Approved/Rejected) is required.'
      });
    }
    
    if (status === 'Rejected' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required for rejected status.'
      });
    }
    
    const vendor = await Vendor.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendor not found.'
      });
    }
    
    // Update vendor status
    vendor.status = status;
    vendor.reviewedAt = Date.now();
    vendor.reviewedBy = req.user.id;
    
    if (status === 'Rejected') {
      vendor.rejectionReason = rejectionReason;
    } else {
      vendor.rejectionReason = undefined;
    }
    
    // Add to status history
    vendor.statusHistory.push({
      status,
      changedBy: req.user.id,
      changedAt: Date.now(),
      comment: status === 'Rejected' ? rejectionReason : `Application ${status.toLowerCase()}`
    });
    
    await vendor.save();
    
    await vendor.populate([
      { path: 'userId', select: 'name email' },
      { path: 'reviewedBy', select: 'name email' },
      { path: 'statusHistory.changedBy', select: 'name email' }
    ]);
    
    res.status(200).json({
      success: true,
      message: `Vendor ${status.toLowerCase()} successfully.`,
      vendor
    });
  } catch (error) {
    console.error('Update vendor status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during status update.'
    });
  }
};

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalApplications = await Vendor.countDocuments();
    const pendingCount = await Vendor.countDocuments({ status: 'Pending' });
    const approvedCount = await Vendor.countDocuments({ status: 'Approved' });
    const rejectedCount = await Vendor.countDocuments({ status: 'Rejected' });
    
    // Get recent vendors
    const recentVendors = await Vendor.find()
      .sort({ submittedAt: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        pendingCount,
        approvedCount,
        rejectedCount
      },
      recentVendors
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics.'
    });
  }
};

