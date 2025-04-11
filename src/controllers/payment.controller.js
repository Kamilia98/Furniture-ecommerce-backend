const asyncWrapper = require('../middlewares/asyncWrapper.middleware');
const stripeService = require('../services/stripe.service');

const createPaymentIntent = asyncWrapper(async (req, res) => {
  const { amount } = req.body;
  const result = await stripeService.createPaymentIntent(amount);
  res.status(200).json(result);
});

module.exports = { createPaymentIntent };