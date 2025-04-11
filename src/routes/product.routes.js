const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.route('/').get(productController.getAllProducts);
router.route('/search').get(productController.getSearchProducts);
router.route('/min-price').get(productController.getMinEffectivePrice);
router.route('/max-price').get(productController.getMaxEffectivePrice);
router
  .route('/comparison/:product_id')
  .get(productController.getProductForComparison);
router.route('/:product_id').get(productController.getProductById);

module.exports = router;
