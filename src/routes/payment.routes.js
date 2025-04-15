const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const verifyToken = require('../middlewares/auth.middleware');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router
  .route('/payment')
  .post(verifyToken, paymentController.createPaymentIntent);

module.exports = router;
