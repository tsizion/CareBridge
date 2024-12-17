const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const User = require("../models/usermodel");
const authUtils = require("../../Utils/authUtils");

// Create a new user
exports.Create = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, password, status } =
    req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Ensure email is provided
  if (!email) {
    return next(new AppError("Email is required", 400));
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction(); // Start a transaction

  try {
    // Check if email or phone number already exists
    const existingUser = await User.findOne({
      $or: [{ "email.address": email }, { phoneNumber }],
    }).session(session); // Pass session for atomicity

    if (existingUser) {
      // If a user with the same email or phone number exists, abort the transaction
      await session.abortTransaction();
      return next(
        new AppError("Email or phone number already registered.", 400)
      );
    }

    // Create the user data object
    const userData = {
      firstName,
      lastName,
      email: {
        address: email,
        verified: false, // Email is not verified initially
      },
      phoneNumber,
      password,
      status,
    };

    // Create the user document in MongoDB
    const newUser = await User.create([userData], { session }); // Pass session for atomicity

    // Generate a token for the newly created user
    const token = authUtils.signToken(newUser[0]._id); // Access the newly created user

    // Commit the transaction if everything is successful
    await session.commitTransaction();
    session.endSession(); // End the session

    res.status(201).json({
      status: "success",
      token,
      user: newUser[0],
    });
  } catch (err) {
    // In case of error, abort the transaction and handle the error
    await session.abortTransaction();
    session.endSession(); // End the session
    next(err); // Pass the error to the global error handler
  }
});

// Google sign-up or login controller
exports.GoogleSignUp = catchAsync(async (req, res, next) => {
  const { googleId, firstName, lastName, email } = req.body;

  // Validate request data
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Check if user already exists with the same Google ID or email
  let user = await User.findOne({
    $or: [{ googleId }, { "email.address": email }],
  });

  if (user) {
    // User exists: Update the Google ID if not already set
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // Create and send JWT token for the existing user
    const token = await authUtils.signToken(user._id);

    return res.status(200).json({
      status: "success",
      token,
      user,
    });
  }

  // If user doesn't exist, create a new user for Google sign-up
  const newUser = await User.create({
    firstName,
    lastName,
    email: { address: email, verified: true }, // Mark email as verified for Google users
    googleId, // Store Google ID
    status: "Active", // Default to active
  });

  // Create a JWT token for the newly created user
  const token = await authUtils.signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    user: newUser,
  });
});

// Read all users
exports.ReadAll = catchAsync(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

// Read a single user by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
exports.ReadOneByUser = catchAsync(async (req, res, next) => {
  // Access the user from req.user, which is set by the protectUser middleware
  const user = req.user;

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

// Update user details
exports.Update = catchAsync(async (req, res, next) => {
  // Use the user ID from req.user (set by the protectUser middleware)
  const userId = req.user._id;
  const { firstName, lastName } = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Create an object to hold the fields that can be updated
  const updateFields = {};

  // Allow only firstName and lastName to be updated
  if (firstName) {
    updateFields.firstName = firstName;
  }
  if (lastName) {
    updateFields.lastName = lastName;
  }

  // If no fields are provided, return an error
  if (Object.keys(updateFields).length === 0) {
    return next(new AppError("No valid fields provided to update", 400));
  }

  // Find the user by ID and update the specified fields
  const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// Delete a user by ID
exports.Delete = catchAsync(async (req, res, next) => {
  // Find the user by ID
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  // Store the user's full name for the success message
  const fullName = `${user.firstName} ${user.lastName}`;

  // Delete the user
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `${fullName} has been successfully deleted.`,
    data: null,
  });
});
