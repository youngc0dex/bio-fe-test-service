const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
  try {
    // EXECUTE QUERY
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'user has been created',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
