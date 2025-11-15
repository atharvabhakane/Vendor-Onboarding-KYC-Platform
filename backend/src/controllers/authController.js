const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

// Login controller
exports.login = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;
    
    // Validate input
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required.' 
      });
    }
    
    // Admin Login - requires password
    if (isAdmin) {
      if (!password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Password is required for admin login.' 
        });
      }
      
      // Check admin credentials from environment variables
      const adminEmail = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;
      
      if (email !== adminEmail || password !== adminPassword) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid admin credentials.' 
        });
      }
      
      // Check if admin user exists in database (by userId 2), update or create
      let user = await User.findOne({ userId: 2, role: 'admin' });
      
      if (!user) {
        user = await User.create({
          userId: 2,
          name: 'Admin',
          email: adminEmail,
          role: 'admin'
        });
        console.log(`✅ Created admin user in database: ${user.email}`);
      } else {
        // Update email if changed
        if (user.email !== adminEmail) {
          user.email = adminEmail;
          await user.save();
          console.log(`✅ Updated admin email to: ${adminEmail}`);
        }
        console.log(`✅ Admin user logged in: ${user.email}`);
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user._id,
          userId: user.userId,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Admin login successful.',
        token,
        user: {
          id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    }
    
    // Vendor Login - email only, check if vendor exists
    const vendor = await Vendor.findOne({ email: email }).populate('userId');
    
    if (!vendor) {
      return res.status(401).json({ 
        success: false, 
        message: 'No vendor found with this email. Please register first.' 
      });
    }
    
    // Get or create user for this vendor
    let user = vendor.userId;
    
    if (!user) {
      // Create user if vendor doesn't have one
      const maxUserId = await User.findOne().sort('-userId').select('userId');
      const nextUserId = maxUserId ? maxUserId.userId + 1 : 1;
      
      user = await User.create({
        userId: nextUserId,
        name: vendor.businessName,
        email: vendor.email,
        role: 'vendor'
      });
      
      vendor.userId = user._id;
      await vendor.save();
      
      console.log(`✅ Created user for vendor: ${user.email}`);
    } else {
      console.log(`✅ Vendor logged in: ${user.email}`);
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        name: user.name
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.status(200).json({
      success: true,
      message: 'Vendor login successful.',
      token,
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login.',
      error: error.message
    });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-__v');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error.' 
    });
  }
};

