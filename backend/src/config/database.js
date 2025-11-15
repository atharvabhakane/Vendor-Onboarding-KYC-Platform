const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log(`📍 Connection string: ${process.env.MONGODB_URI?.substring(0, 30)}...`);
    
    // MongoDB Atlas connection with enhanced options
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increased to 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      family: 4 // Use IPv4, skip trying IPv6
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📊 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📊 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    // Handle connection events
    mongoose.connection.on('connected', () => {
      console.log('📡 Mongoose connected to MongoDB Atlas');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose connection error: ${err.message}`);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('🔄 Mongoose reconnected to MongoDB Atlas');
    });
    
  } catch (error) {
    console.error(`\n❌ ERROR: Failed to connect to MongoDB Atlas`);
    console.error(`📝 Error Message: ${error.message}`);
    console.error(`📝 Error Name: ${error.name}`);
    
    if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Possible solutions:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB URI is correct in .env file');
      console.error('   3. Check if MongoDB Atlas cluster is active');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Authentication failed:');
      console.error('   1. Check username and password in .env file');
      console.error('   2. Verify user has proper permissions in MongoDB Atlas');
    } else if (error.message.includes('timed out')) {
      console.error('\n💡 Connection timeout:');
      console.error('   1. Check your IP is whitelisted in MongoDB Atlas');
      console.error('   2. Go to Network Access → Add IP → Allow Access from Anywhere');
      console.error('   3. Check firewall settings');
    } else {
      console.error('\n💡 Make sure:');
      console.error('   1. MongoDB Atlas IP whitelist includes your current IP');
      console.error('   2. Your internet connection is stable');
      console.error('   3. MongoDB Atlas cluster is running');
    }
    
    console.error('\n⚠️  Server will not start without database connection');
    process.exit(1);
  }
};

module.exports = connectDB;

