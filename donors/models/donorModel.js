const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema(
  {
    referralCaseNumber: {
      type: String,
      unique: true,
      required: [true, "Referral case number is required"],
    },
    referrerName: {
      type: String,
      required: [true, "Referrer's name is required"],
    },
    referrerEmail: {
      type: String,
    },
    referrerPhone: {
      type: String,
      required: [true, "Referrer's phone number is required"],
    },
    studentName: {
      type: String,
      required: [true, "Student's name is required"],
    },
    studentEmail: {
      type: String,
    },
    studentPhone: {
      type: String,
      required: [true, "Student's phone number is required"],
    },
    studentGuardianPhone: {
      type: String,
    },
    studentAddress: {
      type: String,
      required: [true, "Student's address is required"],
    },
    grade: {
      type: String,
      required: function () {
        return this.educationLevel === "High School";
      },
    },
    institution: {
      type: String,
      required: [true, "Institution name is required"],
    },
    universityYear: {
      type: Number,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    hasDisability: {
      type: Boolean,
      default: false,
    },
    disabilityDetails: {
      type: String,
      required: function () {
        return this.hasDisability;
      },
    },
    hasFamilySupport: {
      type: Boolean,
      default: false,
    },
    studentPhotos: {
      type: [String], // Array of strings for storing image URLs
      validate: {
        validator: function (photos) {
          return (
            Array.isArray(photos) &&
            photos.every((photo) => typeof photo === "string")
          );
        },
        message: "Student photos must be an array of strings.",
      },
    },
    document: {
      type: String,
    },
    needDescription: {
      type: String,
      required: [true, "Description of need is required"],
    },
    relationToStudent: {
      type: String,
      required: true,
      enum: ["Teacher", "Parent", "Mentor", "Friend", "Other"],
    },
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referral", ReferralSchema);
module.exports = Referral;
