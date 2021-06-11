const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  if (!users) {
    return next(new AppError("No data found", 404));
  }

  res.json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(new AppError(`No user found with id : ${req.params.id}`, 404));

  res.json({
    status: "success",
    data: {
      user,
    },
  });
});
