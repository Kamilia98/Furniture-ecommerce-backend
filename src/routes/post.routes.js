const express = require('express');
const router = express.Router();
const postControllers = require('../controllers/post.controller');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.route('/').get(postControllers.getAllPosts).post().delete();
router.route('/recent').get(postControllers.getRecentPosts);
router.route('/categories').get(postControllers.getCategories);
router.route('/related').get(postControllers.getRelatedPosts);
router.route('/categories').get(postControllers.getCategories);
router.route('/:id').get(postControllers.getPostById);

module.exports = router;
