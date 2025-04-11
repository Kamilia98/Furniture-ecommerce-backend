const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        color: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number },
      },
    ],
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CartSchema.pre('save', async function (next) {
  try {
    await this.populate('products.id');

    this.totalPrice = this.products.reduce((acc, product) => {
      const price = product.id.price;
      product.subtotal = product.quantity * price;
      return acc + product.subtotal;
    }, 0);

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('Cart', CartSchema);
