const express = require('express');
const testimoniesController = require('./../controllers/testimoniesController');

const router = express.Router();

router
  .route('/')
  .get(testimoniesController.getTestimonies)
  .post(testimoniesController.createTestimonies);

module.exports = router;
