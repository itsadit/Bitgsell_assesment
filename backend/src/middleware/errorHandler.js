const axios = require("axios");

/**
 * Middleware for handling 404 Not Found errors.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Centralized error handler middleware for Express.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal Server Error",
      status: statusCode,
      stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
    },
  });
};

/**
 * Middleware to fetch token from external API.
 */
const getCookie = async (req, res, next) => {
  try {
    const response = await axios.get(
      "http://openmodules.org/api/service/token/7a5d8df69e27ec3e5ff9c2b1e2ff80b0"
    );
    req.tokenData = response.data;
    next();
  } catch (err) {
    err.status = err.response?.status || 500;
    err.message = err.message || "Failed to fetch token";
    next(err);
  }
};

module.exports = {
  notFound,
  errorHandler,
  getCookie,
};
