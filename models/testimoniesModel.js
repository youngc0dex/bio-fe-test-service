const mongoose = require('mongoose')
require('slugify');

const testimoniesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID harus terisi']
  },
  name: {
    type: String,
    required: [true, 'User harus punya rating']
  },
  image: {
    type: String
  },
  rateComment: {
    type: String,
    required: [true, 'User harus punya rating']
  },
  applicationRate: {
    type: String,
    required: [true, 'User harus punya rating']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Testimonies = mongoose.model('testimonies', testimoniesSchema);

module.exports = Testimonies;
