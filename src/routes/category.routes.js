const express = require('express');
const { getAllCategories } = require('../controllers/category.controller');
const router = express.Router();
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

// 1- Get all categories
router.route('/').get(getAllCategories);

module.exports = router;
