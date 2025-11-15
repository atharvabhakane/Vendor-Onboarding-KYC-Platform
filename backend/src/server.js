require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded documents)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Debug route to check database collections
app.get('/api/debug/collections', async (req, res) => {
  try {
    const User = require('./models/User');
    const Vendor = require('./models/Vendor');
    
    const usersCount = await User.countDocuments();
    const vendorsCount = await Vendor.countDocuments();
    const users = await User.find().select('-__v');
    const vendors = await Vendor.find().select('vendorId businessName status');
    
    res.status(200).json({
      success: true,
      database: {
        users: {
          count: usersCount,
          data: users
        },
        vendors: {
          count: vendorsCount,
          data: vendors
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds 5MB limit.'
      });
    }
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;

