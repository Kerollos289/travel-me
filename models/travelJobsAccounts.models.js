const mongoose = require("mongoose");
const travelJobAccountSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Enter email"],
    },
    username: {
      type: String,
      required: [true, "Choose a username"],
    },
    password: {
      type: String,
      required: [true, "Choose a strong password"],
    },
    type: {
      type: String,
      required: [true, "Select your job"],
    },
    mobile: {
      type: String,
      required: [false, "Enter your mobile number"],
    },
    yearsOfExperience: {
      type: Number,
      required: [false, "Enter your years of experience"],
    },
    previousWork: {
      type: String,
      required: false, // Optional field
    },
    accepted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const travelJobAccount = mongoose.model(
  "travelJobAccounts",
  travelJobAccountSchema
);
module.exports = travelJobAccount;
