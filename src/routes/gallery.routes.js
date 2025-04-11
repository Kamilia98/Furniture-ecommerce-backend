const express = require('express');
const {
  updatedImages,
  getImages,
  cloudinaryWebhookHandler,
} = require('../controllers/gallery.controller');

const router = express.Router();
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.get('/updated-images', updatedImages);
router.get('/images', getImages);
// router.post("/cloudinary-webhook", cloudinaryWebhookHandler);

module.exports = router;
