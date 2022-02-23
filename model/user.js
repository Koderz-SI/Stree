const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },

  googleId: {
    type: String,
  },
  provide: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
