const { type } = require("@testing-library/user-event/dist/type");
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
    documentPath: {
      type: String,
      required: false,
    },
    documentUploaded: {
      type: Boolean,
      default: false,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    hotline: {
      type: Number,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    companyProfile: {
      type: String,
      required: false,
    },
    itinerariesArray: {
      type: [String], // Array of strings for itinerary names
      default: [], // Initialize as an empty array
      required: false,
    },
    activitiesArray: {
      type: [String],
      default: [], // Initialize as an empty array
      required: false,
    },
    touristsNameItineraries: {
      type: [String],
      default: [], // Initialize as an empty array
      required: false,
    },
    touristsNameActivities: {
      type: [String],
      default: [], // Initialize as an empty array
      required: false,
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
