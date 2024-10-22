// src/pages/forgetPassword.js
import React, { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3500/api/forget-password/request",
        {
          email,
        }
      );
      if (response.data.success) {
        setOtpSent(true);
        setSuccessMessage("OTP sent to your email!");
        setErrorMessage("");
      }
    } catch (error) {
      setErrorMessage("Email not found or an error occurred.");
      setSuccessMessage("");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3500/api/forget-password/verify",
        {
          email,
          otp,
          newPassword,
        }
      );
      if (response.data.success) {
        setSuccessMessage("Password updated successfully!");
        setErrorMessage("");
        // Optionally, redirect or reset state here
      }
    } catch (error) {
      setErrorMessage("Incorrect OTP or an error occurred.");
      setSuccessMessage("");
    }
  };

  return (
    <div>
      <h2>Forget Password</h2>
      {!otpSent ? (
        <form onSubmit={handleEmailSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send OTP</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit}>
          <div>
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div>
            <label>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Reset Password</button>
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
        </form>
      )}
    </div>
  );
};

export default ForgetPassword;