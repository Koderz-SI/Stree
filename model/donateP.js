const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: String,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },

  buyer: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('donateP', donationSchema);
