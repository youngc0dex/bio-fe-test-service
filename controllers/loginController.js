const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/userModel');

function generateAccessToken(username) {
  return jwt.sign(username, '09f26e402586e2faa8da4c98a35f1b20d6b033c6', {
    expiresIn: '3600s'
  });
}

exports.loginUser = async (req, res, next) => {
  try {
    const parameters = {
      userId: req.body.userId,
      password: req.body.password
    };

    const user = await User.findOne({ userId: parameters.userId });

    if (!user) {
      return res.status(401).json({ status:401,message: 'Username & Password salah' });
    }

    const passwordMatch = await bcrypt.compare(
      parameters.password,
      user.password
    );

    if (passwordMatch) {
      const token = generateAccessToken({
        userId: user.userId,
        name: user.name
      });

      res.status(200).json({
        status: 'berhasil login!',
        data: {
          name:user.name,
          accessToken: token
        }
      });
    } else {
      return res.status(401).json({ error: 'Username & Password salah' });
    }
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err
    });
  }
};

exports.registerUser = async (req, res, next) => {
  try {
    const { userId, name, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      userId: userId,
      name: name,
      password: hashedPassword
    });

    res.status(201).json({
      status: 'Berhasil daftar',
      data: { userId: newUser.userId, name: newUser.name }
    });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(400).json({
        status: 'Gagal',
        message: 'User id sudah ada, coba yang lain'
      });
    }
    res.status(400).json({
      status: 'Gagal membuat user',
      message: err
    });
  }
};
