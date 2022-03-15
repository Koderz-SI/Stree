const mongoose = require('mongoose');

const addSchema = new mongoose.Schema({
  product: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('addP', addSchema);
