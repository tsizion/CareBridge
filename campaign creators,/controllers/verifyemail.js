const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const User = require("../models/usermodel");
const authUtils = require("../../Utils/authUtils");
const { sendVerificationEmail } = require("../../Utils/emailUtils"); // Assuming you have an email utility for sending email
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");
// Verify email controller
exports.VerifyEmail = catchAsync(async (req, res, next) => {
  const { verificationToken } = req.params;

  // Find user by verification token
  const user = await User.findOne({
    verificationToken,
    verificationTokenExpiresAt: { $gt: Date.now() }, // Check if token is expired
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification token", 400));
  }

  // Mark email as verified
  user.email.verified = true;
  user.verificationToken = undefined; // Clear the token
  user.verificationTokenExpiresAt = undefined; // Clear the expiration time

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Your email has been successfully verified.",
  });
});
