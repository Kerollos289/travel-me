//touristAccounts.models.js
const mongoose = require("mongoose");

const touristAccountSchema = mongoose.Schema(
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
    mobile_Number: {
      type: Number,
      required: [true, "Enter your phone number"],
    },
    nationality: {
      type: String,
      required: [true, "Enter your nationality"],
    },
    DOB: {
      type: Date,
      required: [true, "Enter your date of birth"],
    },
    job: {
      type: String,
      required: [true, "Please state if you are a student or state your job"],
    },
    type: {
      type: String,
      default: "tourist",
      required: [true, "type"],
    },
    wallet: {
      type: Number,
      default: 0, // Initialize wallet with 0 currency
    },
    loyaltyPoints: {
      type: Number,
      default: 0, // Start with 0 loyalty points
    },
    badgeLevel: {
      type: String,
      default: "Bronze", // Initial badge level
      enum: ["Bronze", "Silver", "Gold"], // Allowed levels
    },
    bookedItineraries: {
      type: [String],
      default: [],
      required: false,
    },
    bookedActivity: {
      type: [String],
      default: [],
      required: false,
    },
    preferences: {
      type: [String],
      default: [],
    },
    bookmarkedActivities: {
      type: [String],
      default: [],
      required: false,
    },
    bookmarkedItineraries: {
      type: [String],
      default: [],
      required: false,
    },
    paidItineraries: {
      type: [String],
      default: [],
      required: false,
    },
    attendedItineraries: {
      type: [String],
      default: [],
      required: false,
    },
    paidActivity: {
      type: [String],
      default: [],
      required: false,
    },
    attendedActivity: {
      type: [String],
      default: [],
      required: false,
    },
  },
  {
    timestamps: true, // Fixed typo (timeStamps -> timestamps)
  }
);

const touristAccount = mongoose.model("touristAccounts", touristAccountSchema);
module.exports = touristAccount;
