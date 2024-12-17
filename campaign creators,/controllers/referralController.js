const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const Referral = require("../models/referralModel");
const User = require("../models/usermodel");

// Utility to filter only valid fields
const filterFields = (obj, allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      filtered[key] = obj[key];
    }
  });
  return filtered;
};

// Create a new referral
exports.Create = catchAsync(async (req, res, next) => {
  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Ensure user is logged in
  if (!req.user) {
    return next(
      new AppError("You must be logged in to create a referral.", 401)
    );
  }

  // Fetch logged-in user's data
  const loggedInUser = await User.findById(req.user._id);
  if (!loggedInUser) {
    return next(new AppError("User not found", 404));
  }

  // Extract referrer details from logged-in user
  const referrerName = `${loggedInUser.firstName} ${loggedInUser.lastName}`;
  const referrerEmail = loggedInUser.email?.address || loggedInUser.email; // Handle email as object or string
  const referrerPhone = loggedInUser.phoneNumber;

  // Define allowed fields in the Referral model
  const allowedFields = [
    "studentName",
    "studentEmail",
    "studentPhone",
    "studentGuardianPhone",
    "studentAddress",
    "institution",
    "universityYear",
    "department",
    "hasDisability",
    "disabilityDetails",
    "hasFamilySupport",
    "studentPhotos",
    "needDescription",
    "relationToStudent",
  ];

  // Filter request body to include only allowed fields
  const filteredBody = filterFields(req.body, allowedFields);

  // Add referrer details and createdBy field
  const referralData = {
    ...filteredBody,
    referrerName,
    referrerEmail,
    referrerPhone,
    createdBy: req.user._id,
  };

  // Create the referral
  const newReferral = await Referral.create(referralData);

  res.status(201).json({
    status: "success",
    data: {
      referral: newReferral,
    },
  });
});

// Read all referrals
exports.ReadAll = catchAsync(async (req, res, next) => {
  const referrals = await Referral.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: referrals.length,
    data: {
      referrals,
    },
  });
});

// Read a single referral by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const referral = await Referral.findById(req.params.id);

  if (!referral) {
    return next(new AppError("Referral not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      referral,
    },
  });
});

// Update a referral by ID
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Define allowed fields in the Referral model
  const allowedFields = [
    "studentName",
    "studentEmail",
    "studentPhone",
    "studentGuardianPhone",
    "studentAddress",
    "institution",
    "universityYear",
    "department",
    "hasDisability",
    "disabilityDetails",
    "hasFamilySupport",
    "studentPhotos",
    "needDescription",
    "relationToStudent",
  ];

  // Filter request body to include only allowed fields
  const filteredBody = filterFields(req.body, allowedFields);

  // Update the referral document
  const updatedReferral = await Referral.findByIdAndUpdate(id, filteredBody, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation rules are applied
  });

  if (!updatedReferral) {
    return next(new AppError("Referral not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      referral: updatedReferral,
    },
  });
});

// Delete a referral by ID
exports.Delete = catchAsync(async (req, res, next) => {
  const referral = await Referral.findById(req.params.id);

  if (!referral) {
    return next(new AppError("Referral not found", 404));
  }

  await Referral.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Referral ${referral.referralCaseNumber} has been successfully deleted.`,
    data: null,
  });
});
