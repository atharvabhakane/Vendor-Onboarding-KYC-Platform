const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorId: {
    type: String,
    unique: true,
    // Auto-generated, so not required in schema validation
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Optional - will be assigned on first login
  },
  businessName: {
    type: String,
    required: true,
    trim: true
  },
  businessType: {
    type: String,
    required: true,
    enum: ['Manufacturing', 'Services', 'Trading', 'IT/Software', 'Construction', 'Agriculture', 'Retail', 'Healthcare', 'Education', 'Other']
  },
  contactPerson: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    street: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true,
      default: 'India'
    }
  },
  documents: [{
    documentType: {
      type: String,
      required: true,
      enum: ['GST', 'PAN', 'Registration Certificate', 'Other']
    },
    fileName: {
      type: String,
      required: true
    },
    fileUrl: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: {
    type: String
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    comment: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Auto-generate vendorId before saving
vendorSchema.pre('save', async function(next) {
  if (this.isNew && !this.vendorId) {
    try {
      // Find all vendors and sort by createdAt to get the latest
      const lastVendor = await this.constructor.findOne({})
        .sort({ createdAt: -1 })
        .select('vendorId')
        .lean();
      
      let nextId = 1;
      if (lastVendor && lastVendor.vendorId) {
        // Extract number from VEN-00001 format
        const match = lastVendor.vendorId.match(/VEN-(\d+)/);
        if (match) {
          nextId = parseInt(match[1]) + 1;
        }
      }
      
      // Generate new vendorId with zero-padding
      this.vendorId = `VEN-${String(nextId).padStart(5, '0')}`;
      console.log(`✅ Generated vendorId: ${this.vendorId}`);
    } catch (error) {
      console.error('❌ Error generating vendorId:', error);
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);

