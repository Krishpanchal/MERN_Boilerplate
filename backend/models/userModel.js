const crypto = require("crypto");
const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "A user must have an email"],
    validate: [Validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: [5, "A password must have atleast 5 charater"],
    select: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.isPasswordCorrect = async function (
  userEnteredPassword,
  password
) {
  return await bcrypt.compare(userEnteredPassword, password);
};

userSchema.methods.createToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * (60 * 1000);

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
