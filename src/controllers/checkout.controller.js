const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");

const asyncWrapper = require("../middlewares/asyncWrapper.middleware");

const placeOrder = asyncWrapper(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod, transactionId } = req.body;
    console.log("req.body>>>>>>>>>>", req.body);
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return next(new AppError("Invalid User ID", 400, httpStatusText.FAIL));
    }

    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return next(new AppError("Cart is empty", 400, httpStatusText.FAIL));
    }
    const orderItems = cart.products.map((item) => {
      const effectivePrice =
        item.productId.productPrice * (1 - item.productId.productSale / 100);
      return {
        productId: item.productId._id,
        productName: item.productId.productName,
        quantity: item.quantity,
        price: effectivePrice,
        subtotal: effectivePrice * item.quantity,
      };
    });
    console.log("-----------------------------");
    console.log("cart.products>>>>>>>>>>>", cart.products);
    console.log("-----------------------------");
    console.log("orderItems>>>>>>>>>>>", orderItems);
    console.log("-----------------------------");
    console.log("cart>>>>>>>>>>>", cart);

    for (const item of cart.products) {
      console.log("quantiti", item.quantity, item.productId.productQuantity);
      if (item.quantity > item.productId.productQuantity) {
        return next(
          new AppError(
            `Not enough stock for ${item.productId.productName}. Available: ${item.productId.productQuantity} Requested: ${item.quantity}`,
            400,
            httpStatusText.FAIL
          )
        );
      }
    }
    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.subtotal,
      0
    );
    const order = new Order({
      userId,
      orderItems,
      shippingAddress,
      totalAmount,
      paymentMethod,
      transactionId,
    });

    await order.save();

    const updatePromises = cart.products.map((item) =>
      Product.updateOne(
        { _id: item.productId._id },
        { $inc: { productQuantity: -item.quantity } }
      )
    );

    await Promise.all(updatePromises);
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: "Order placed successfully!", order });
  } catch (error) {
    console.error("Error placing order:", error);
    return next(
      new AppError("Failed to place order", 500, httpStatusText.ERROR)
    );
  }
});

module.exports = { placeOrder };
