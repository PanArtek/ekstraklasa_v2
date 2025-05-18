const mongoose = require('mongoose');

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, { collection: 'stadiums' });

module.exports = mongoose.model('Stadium', stadiumSchema, 'stadiums');