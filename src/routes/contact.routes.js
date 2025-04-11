const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // max 100 requests per windowMs
// });

// router.use(limiter);

router.post('/send-message', contactController.sendMessage);

module.exports = router;
