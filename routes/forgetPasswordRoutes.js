// routes/forgetPasswordRoutes.js
const express = require("express");
const router = express.Router();
const touristAccount = require("../models/touristsAccounts.models.js");
const travelJobAccount = require("../models/travelJobsAccounts.models.js");
const nodemailer = require("nodemailer");

// Function to generate a random 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Function to send an email with the OTP
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app-specific password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

// Store OTP temporarily in-memory for this example
const otpStore = {};

// Request OTP
router.post("/request", async (req, res) => {
  const { email } = req.body;

  const touristAccountExists = await touristAccount.findOne({ email });
  const travelJobAccountExists = await travelJobAccount.findOne({ email });

  if (touristAccountExists || travelJobAccountExists) {
    const otp = generateOTP();
    otpStore[email] = otp; // Store OTP for verification
    await sendOtpEmail(email, otp);
    return res.json({ success: true });
  }

  res.status(404).json({ success: false, message: "Email not found" });
});

// Verify OTP and reset password
router.post("/verify", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (otpStore[email] && otpStore[email] === otp) {
    // Find account and update password
    const touristAccountExists = await touristAccount.findOneAndUpdate(
      { email },
      { password: newPassword }
    );
    const travelJobAccountExists = await travelJobAccount.findOneAndUpdate(
      { email },
      { password: newPassword }
    );

    if (touristAccountExists || travelJobAccountExists) {
      delete otpStore[email]; // Clear OTP after successful reset
      return res.json({ success: true });
    }
  }

  res.status(400).json({ success: false, message: "Invalid OTP" });
});

module.exports = router;
