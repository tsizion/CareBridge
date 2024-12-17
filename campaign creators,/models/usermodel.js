const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    // User's First Name
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },

    // User's Last Name
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },

    // Email (Shared between manual and Google signups)
    email: {
      address: {
        type: String,
        required: [true, "Email is required"], // Email is now required
        unique: true,
        sparse: true, // Allows unique constraint to ignore null values
      },
      verified: {
        type: Boolean,
        default: false, // Default is false for manual users, assume verified for Google users
      },
    },

    // Google OAuth ID
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows null values for non-Google users
    },

    // Phone Number (Optional, for manual signup or OTP)
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    // Password (Optional: required only for manual signups)
    password: {
      type: String,
      minlength: 6,
      select: false, // Do not return the password by default
      required: function () {
        return !this.googleId; // Password required only if not a Google user
      },
    },

    // Profession (Optional)
    profession: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpiresAt: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

//
// Hooks and Methods
//

// Pre-save hook: Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare password for login
userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to create a reset password token
userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  return crypto.createHash("sha256").update(resetToken).digest("hex");
};

const User = mongoose.model("User", userSchema);
module.exports = User;
