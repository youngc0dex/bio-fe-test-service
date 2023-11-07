const mongoose = require('mongoose');
require('slugify');

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User harus punya user id'],
    unique: [true, 'User dengan id ini sudah ada']
  },
  name: {
    type: String,
    required: [true, 'User harus punya name']
  },
  password: {
    type: String,
    required: [true, 'User harus punya password']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;
