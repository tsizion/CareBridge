const { validationResult } = require("express-validator");
const AppError = require("../../ErrorHandlers/appError");
const catchAsync = require("../../ErrorHandlers/catchAsync");
const StudentInfo = require("../models/studentModel"); // Assuming your model is named studentInfoModel

// Create a new student info entry
exports.Create = catchAsync(async (req, res, next) => {
  const {
    studentName,
    studentEmail,
    studentPhone,
    studentAddress,
    educationLevel,
    grade,
    institution,
    universityYear,
    department,
    hasDisability,
    disabilityDetails,
    hasFamilySupport,
    familyDetails,
    fundingNeeds,
  } = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Create the student information object
  const studentInfoData = {
    studentName,
    studentEmail,
    studentPhone,
    studentAddress,
    educationLevel,
    grade,
    institution,
    universityYear,
    department,
    hasDisability,
    disabilityDetails,
    hasFamilySupport,
    familyDetails,
    fundingNeeds,
  };

  // Create a new student info entry in MongoDB
  const newStudentInfo = await StudentInfo.create(studentInfoData);

  res.status(201).json({
    status: "success",
    data: {
      studentInfo: newStudentInfo,
    },
  });
});

// Read all student info entries
exports.ReadAll = catchAsync(async (req, res, next) => {
  const students = await StudentInfo.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: students.length,
    data: {
      students,
    },
  });
});

// Read a single student info entry by ID
exports.ReadOne = catchAsync(async (req, res, next) => {
  const student = await StudentInfo.findById(req.params.id);

  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

// Update student info details
exports.Update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateFields = req.body;

  // Validate request data using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError("Validation failed", 400, errors.array()));
  }

  // Find the student by ID and update the specified fields
  const updatedStudent = await StudentInfo.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  });

  if (!updatedStudent) {
    return next(new AppError("Student not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      student: updatedStudent,
    },
  });
});

// Delete a student info entry by ID
exports.Delete = catchAsync(async (req, res, next) => {
  // Find the student by ID
  const student = await StudentInfo.findById(req.params.id);

  if (!student) {
    return next(new AppError("Student not found", 404));
  }

  // Delete the student info entry
  await StudentInfo.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: `Student ${student.studentName} has been successfully deleted.`,
    data: null,
  });
});
