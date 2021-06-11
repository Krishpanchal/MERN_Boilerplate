const AppError = require("../utils/appError");

module.exports = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new AppError(message, 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("The user token is expired. Please login again!", 401);
  }

  res.status(error.statusCode || 500).json({
    status: error.status,
    error: error.message || "Something went wrong",
  });
};
