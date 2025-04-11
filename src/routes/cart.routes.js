const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const verifyToken = require('../middlewares/auth.middleware');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.route('/').get(verifyToken, cartController.getUserCart); // GET User Cart
router
  .route('/')
  .post(verifyToken, cartController.addToCart) // Add Items
  .patch(verifyToken, cartController.updateCart);

module.exports = router;
