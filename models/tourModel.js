const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tujuan harus punya nama'],
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: [true, 'Tujuan harus punya slogan'],
    unique: false,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Tujuan harus punya gambar']
  },
  price: {
    type: Number,
    required: [true, 'Tujuan harus punya harga']
  },
  rating: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
