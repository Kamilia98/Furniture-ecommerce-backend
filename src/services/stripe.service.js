const stripe = require('../config/stripeConfig');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');

class StripeService {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency,
        payment_method_types: ['card']
      });

      return {
        status: httpStatusText.SUCCESS,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id
        }
      };
    } catch (err) {
      throw new AppError(
        `Stripe error: ${err.message}`,
        500,
        httpStatusText.ERROR
      );
    }
  }
}

module.exports = new StripeService();