const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['vendor', 'admin'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

