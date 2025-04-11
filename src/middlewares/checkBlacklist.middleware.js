const AppError = require('../utils/appError');
const { httpStatusText } = require('../utils/httpStatusText');

// In-memory blacklist (for development/testing)
// In production, consider using Redis or a database
const tokenBlacklist = new Set();

const checkBlacklist = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // No token means nothing to blacklist-check, move on
  }

  const token = authHeader.split(' ')[1];

  if (tokenBlacklist.has(token)) {
    return next(
      new AppError(
        'This token has been blacklisted. Please log in again.',
        401,
        httpStatusText.FAIL
      )
    );
  }

  next();
};

// Expose both the middleware and blacklist set
module.exports = {
  checkBlacklist,
  tokenBlacklist,
};
