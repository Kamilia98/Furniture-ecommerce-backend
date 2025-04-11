const mongoose = require("mongoose");
const httpStatusText = require("../utils/httpStatusText");
const AppError = require("../utils/appError");
const Cart = require("../models/cart.model");
const asyncWrapper = require("../middlewares/asyncWrapper.middleware");
const Product = require("../models/product.model");

// GET: Retrieve user cart
const getUserCart = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  console.log("my cart user :", userId);
  const cart = await Cart.findOne({ userId })
    .populate(
      "products.productId",
      "_id productName colors productPrice productSale"
    )
    .lean();

  if (!cart) {
    return next(new AppError("Cart not found.", 404, httpStatusText.FAIL));
  }

  const products = cart.products
    .map(({ productId, quantity, color }) => {
      if (!productId) {
        return null; // Product was removed from DB
      }

      const colorVariant = productId.colors.find((c) => c.name === color);

      if (!colorVariant) {
        return null;
      }

      const availableQuantity = colorVariant.quantity;

      const finalQuantity = Math.min(quantity, availableQuantity);

      const effectivePrice = productId.productSale
        ? productId.productPrice * (1 - productId.productSale / 100)
        : productId.productPrice;

      return {
        _id: productId._id,
        productQuantity: finalQuantity,
        productName: productId.productName,
        productImage:
          colorVariant.images.length > 0 ? colorVariant.images[0].url : null,
        productColor: colorVariant.name,
        productPrice: effectivePrice,
        productSubtotal: finalQuantity * effectivePrice,
      };
    })
    .filter((product) => product !== null);
  const totalPrice = products.reduce(
    (sum, item) => sum + item.productSubtotal,
    0
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      products,
      totalPrice,
    },
  });
});

// POST: Add products to cart
const addToCart = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  const items = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new AppError("Invalid cart items.", 400, httpStatusText.FAIL));
  }

  for (const item of items) {
    const { productId, quantity, color } = item;

    if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 1) {
      return next(
        new AppError(
          "Invalid productId or quantity. Quantity must be at least 1.",
          400,
          httpStatusText.FAIL
        )
      );
    }

    const product = await Product.findById(productId).select("colors");
    if (!product) {
      return next(new AppError("Product not found.", 404, httpStatusText.FAIL));
    }

    if (!color && product.colors.length > 0) {
      item.color = product.colors[0].name;
    }

    const colorVariant = product.colors.find((c) => c.name === item.color);
    if (!colorVariant) {
      return next(
        new AppError(
          `Color ${item.color} not available for this product.`,
          400,
          httpStatusText.FAIL
        )
      );
    }
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, products: [] });
  }

  for (const { productId, quantity, color } of items) {
    const product = await Product.findById(productId).lean();
    const colorVariant = product.colors.find((c) => c.name === color);
    const availableQuantity = colorVariant.quantity;
    const finalQuantity = Math.min(quantity, availableQuantity);

    const existingProduct = cart.products.find(
      (p) => p.productId.toString() === productId && p.color === color
    );

    if (existingProduct) {
      existingProduct.quantity = Math.min(
        availableQuantity,
        existingProduct.quantity + finalQuantity
      );
    } else {
      cart.products.push({ productId, quantity: finalQuantity, color });
    }
  }

  await cart.save();
  cart = await Cart.findOne({ userId })
    .populate(
      "products.productId",
      "_id productName colors productPrice productSale"
    )
    .lean();

  const products = cart.products
    .map(({ productId, quantity, color }) => {
      if (!productId) return null;

      const colorVariant = productId.colors.find((c) => c.name === color);
      if (!colorVariant) return null;

      const availableQuantity = colorVariant.quantity;
      const finalQuantity = Math.min(quantity, availableQuantity);

      const effectivePrice = productId.productSale
        ? productId.productPrice * (1 - productId.productSale / 100)
        : productId.productPrice;

      return {
        _id: productId._id,
        productQuantity: finalQuantity,
        productName: productId.productName,
        productImage:
          colorVariant.images.length > 0 ? colorVariant.images[0].url : null,
        productColor: colorVariant.name,
        productPrice: effectivePrice,
        productSubtotal: finalQuantity * effectivePrice,
      };
    })
    .filter((product) => product !== null);

  const totalPrice = products.reduce(
    (sum, item) => sum + item.productSubtotal,
    0
  );

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: {
      products,
      totalPrice,
    },
  });
});

// PATCH: Update cart (change quantity or remove a product)
const updateCart = asyncWrapper(async (req, res, next) => {
  const userId = req.user._id;
  let { productId, quantity, color } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId) || quantity < 0) {
    return next(
      new AppError(
        "Invalid productId, quantity, or color.",
        400,
        httpStatusText.FAIL
      )
    );
  }
  const product = await Product.findById(productId).select("colors");
  if (!product) {
    return next(new AppError("Product not found.", 404, httpStatusText.FAIL));
  }

  if (!color && product.colors.length > 0) {
    color = product.colors[0].name;
  }
  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return next(new AppError("Cart not found.", 404, httpStatusText.FAIL));
  }

  const productIndex = cart.products.findIndex(
    (p) => p.productId.toString() === productId && p.color === color
  );

  if (productIndex === -1) {
    return next(
      new AppError(
        "Product with this color not found in cart.",
        404,
        httpStatusText.FAIL
      )
    );
  }

  if (quantity > 0) {
    cart.products[productIndex].quantity = quantity;
  } else {
    cart.products.splice(productIndex, 1);
  }

  await cart.save();
  await cart.populate(
    "products.productId",
    "_id productName colors productPrice"
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { cart },
  });
});

module.exports = {
  getUserCart,
  addToCart,
  updateCart,
};
