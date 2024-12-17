// In your emailUtils.js
const nodemailer = require("nodemailer");
const { Verification_Email_Template } = require("../middleware/emailtemplate");

// Configure your email service (e.g., Gmail, SendGrid, etc.)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "Tsionephrem7@gmail.com",
    pass: "hjmt ksfp xnhh ggqm",
  },
});

exports.sendVerificationEmail = async (email, verificationLink) => {
  try {
    const mailOptions = {
      from: "tsionephrem7@gmail.com",
      to: email,
      subject: "Please verify your email address",
      html: Verification_Email_Template.replace(
        "{verificationLink}",
        verificationLink
      ), // Replace the placeholder in the template
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending verification email:", error);
  }
};
