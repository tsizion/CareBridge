const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema(
  {
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
    institution: {
      type: String,
      required: [true, "Institution name is required"],
    },
    universityYear: {
      type: String,
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
    studentPictures: {
      type: [String], // Array of image URLs
      validate: {
        validator: function (value) {
          return value.length <= 3; // Limit to 3 images
        },
        message: "You can upload a maximum of 3 pictures.",
      },
    },
    document: {
      type: String, // Store the path of the uploaded document
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
