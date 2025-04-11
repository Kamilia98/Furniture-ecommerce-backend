const mongoose = require('mongoose');
const httpStatusText = require('../utils/httpStatusText');
const AppError = require('../utils/appError');
const Product = require('../models/product.model');
const asyncWrapper = require('../middlewares/asyncWrapper.middleware');

const getAllProducts = asyncWrapper(async (req, res, next) => {
  let {
    limit = 16,
    page = 1,
    categories = '',
    order = 'desc',
    sortBy = 'date',
    minPrice,
    maxPrice,
  } = req.query;

  // Convert pagination values to numbers
  limit = Number(limit);
  page = Number(page);

  if (isNaN(limit) || isNaN(page) || limit < 1 || page < 1) {
    return next(
      new AppError('Invalid pagination parameters.', 400, httpStatusText.FAIL)
    );
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === 'asc' ? 1 : -1;

  // Define valid sort fields
  const sortFields = {
    name: 'name',
    date: 'date',
    price: 'effectivePrice',
  };

  // Validate sortBy value
  const sortField = sortFields[sortBy] || 'date';

  // Category filter
  let categoryFilter = {};
  if (categories) {
    const categoryIds = categories.split(',').map((id) => id.trim());

    if (!categoryIds.every((id) => mongoose.isValidObjectId(id))) {
      return next(
        new AppError('Invalid Category ID format.', 400, httpStatusText.FAIL)
      );
    }

    categoryFilter = {
      categories: {
        $in: categoryIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    };
  }

  // Fetch min & max price dynamically if not provided
  if (!minPrice || !maxPrice) {
    const { minPrice: min, maxPrice: max } = await getPriceRange();
    minPrice = minPrice ?? min;
    maxPrice = maxPrice ?? max;
  }

  minPrice = Number(minPrice);
  maxPrice = Number(maxPrice);

  // Price filter
  const priceFilter =
    !isNaN(minPrice) && !isNaN(maxPrice)
      ? { effectivePrice: { $gte: minPrice, $lte: maxPrice } }
      : {};

  // Fetch total products count and products list concurrently
  const [totalProducts, products] = await Promise.all([
    getTotalProducts(categoryFilter, priceFilter),
    getFilteredProducts(
      categoryFilter,
      priceFilter,
      sortField,
      sortOrder,
      skip,
      limit
    ),
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { totalProducts, products },
  });
});

// Function to get price range
const getPriceRange = async () => {
  const result = await Product.aggregate([
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$effectivePrice' },
        maxPrice: { $max: '$effectivePrice' },
      },
    },
  ]);

  return result[0] || { minPrice: 0, maxPrice: 0 };
};

// Function to get total products count
const getTotalProducts = async (categoryFilter, priceFilter) => {
  const result = await Product.aggregate([
    { $match: categoryFilter },
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    { $match: priceFilter },
    { $count: 'total' },
  ]);

  return result.length > 0 ? result[0].total : 0;
};

// Function to get filtered products
const getFilteredProducts = async (
  categoryFilter,
  priceFilter,
  sortField,
  sortOrder,
  skip,
  limit
) => {
  return await Product.aggregate([
    { $match: categoryFilter },
    { $addFields: { effectivePrice: calculateEffectivePrice() } },
    { $match: priceFilter },
    { $sort: { [sortField]: sortOrder } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'categories',
        localField: 'categories',
        foreignField: '_id',
        as: 'categories',
      },
    },
    {
      $addFields: {
        firstColor: { $arrayElemAt: ['$colors', 0] },
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        subtitle: 1,
        image: {
          $arrayElemAt: ['$firstColor.images.url', 0],
        },
        price: 1,
        date: 1,
        sale: 1,
        quantity: '$firstColor.quantity',
        effectivePrice: 1,
        mainColor: '$firstColor.name',
        categories: {
          $map: {
            input: '$categories',
            as: 'category',
            in: { _id: '$$category._id', name: '$$category.name' },
          },
        },
      },
    },
  ]);
};

// Function to calculate effective price
const calculateEffectivePrice = () => ({
  $cond: {
    if: { $gt: ['$sale', 0] },
    then: {
      $multiply: ['$price', { $subtract: [1, { $divide: ['$sale', 100] }] }],
    },
    else: '$price',
  },
});

// Function to project required fields
const projectFields = () => ({
  _id: 1,
  name: 1,
  subtitle: 1,
  productImages: 1,
  price: 1,
  date: 1,
  sale: 1,
  quantity: 1,
  effectivePrice: 1,
});

// Function to lookup categories
const lookupCategories = () => ({
  from: 'categories',
  localField: 'categories',
  foreignField: '_id',
  as: 'categories',
});

// Function to project category names
const projectCategoryNames = () => ({
  _id: 1,
  name: 1,
  subtitle: 1,
  productImages: 1,
  price: 1,
  date: 1,
  sale: 1,
  quantity: 1,
  effectivePrice: 1,
  categories: {
    $map: {
      input: '$categories',
      as: 'category',
      in: { _id: '$$category._id', name: '$$category.name' },
    },
  },
});

const getProductById = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError('Product ID is required', 400, httpStatusText.FAIL)
    );
  }
  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError('Invalid Product ID format', 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      '_id name subtitle price date sale categories description brand colors additionalInformation'
    )
    .populate('categories', 'name')
    .lean();

  if (!product) {
    return next(new AppError('Product not found', 404, httpStatusText.FAIL));
  }
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { product },
  });
});

const getMinEffectivePrice = asyncWrapper(async (req, res, next) => {
  const minPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ['$sale', 0] }, // If there's a discount
            then: {
              $multiply: [
                '$price',
                { $subtract: [1, { $divide: ['$sale', 100] }] },
              ],
            },
            else: '$price', // Otherwise, use original price
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        minEffectivePrice: { $min: '$effectivePrice' },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      minEffectivePrice: minPrice.length ? minPrice[0].minEffectivePrice : 0,
    },
  });
});

const getMaxEffectivePrice = asyncWrapper(async (req, res, next) => {
  const maxPrice = await Product.aggregate([
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ['$sale', 0] },
            then: {
              $multiply: [
                '$price',
                { $subtract: [1, { $divide: ['$sale', 100] }] },
              ],
            },
            else: '$price',
          },
        },
      },
    },
    {
      $group: {
        _id: null,
        maxEffectivePrice: { $max: '$effectivePrice' },
      },
    },
  ]);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      maxEffectivePrice: maxPrice.length ? maxPrice[0].maxEffectivePrice : 0,
    },
  });
});

const getProductForComparison = asyncWrapper(async (req, res, next) => {
  const { product_id } = req.params;
  if (!product_id) {
    return next(
      new AppError('Product ID is required', 400, httpStatusText.FAIL)
    );
  }

  if (!mongoose.isValidObjectId(product_id)) {
    return next(
      new AppError('Invalid Product ID format', 400, httpStatusText.FAIL)
    );
  }

  const product = await Product.findById(product_id)
    .select(
      '_id name subtitle productImages price quantity date sale categories description colors sizes brand additionalInformation'
    )
    .populate('categories', 'name')
    .lean();

  if (!product) {
    return next(new AppError('Product not found', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      product,
    },
  });
});

const getSearchProducts = asyncWrapper(async (req, res, next) => {
  const { query } = req.query;
  if (!query) {
    return next(
      new AppError('Please enter a search keyword!', 400, httpStatusText.FAIL)
    );
  }

  const categoryIds = await getCategoryIds(query);

  const products = await Product.find({
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { categories: { $in: categoryIds } },
    ],
  })
    .populate('categories', 'name')
    .lean();

  if (!products.length) {
    return next(new AppError('No products found.', 404, httpStatusText.FAIL));
  }

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: products,
  });
});

async function getCategoryIds(query) {
  const categories = await require('../models/category.model')
    .find({ name: { $regex: query, $options: 'i' } })
    .select('_id')
    .lean();
  return categories.map((cat) => cat._id);
}

module.exports = {
  getAllProducts,
  getProductById,
  getMinEffectivePrice,
  getMaxEffectivePrice,
  getProductForComparison,
  getSearchProducts,
};
