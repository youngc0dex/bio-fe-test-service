const jwt = require('jsonwebtoken');
const Testimonies = require('../models/testimoniesModel');

exports.getTestimonies = async (req, res) => {
  try {
    const { limit } = req.query;

    const testimonies = await Testimonies.find().limit(limit);

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: testimonies.length,
      data: testimonies
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTestimonies = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const dataToken = jwt.decode(token);

    const testimoni = await Testimonies.create({
      ...req.body,
      userId: dataToken.userId,
      name: dataToken.name,
      image: dataToken.image || null
    });

    res.status(200).json({
      status: 'Data berhasil dibuat',
      data: testimoni
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
