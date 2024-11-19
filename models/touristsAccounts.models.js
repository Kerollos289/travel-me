const { type } = require("@testing-library/user-event/dist/type");
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
      required: [true, "Enter your nationallity"],
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
      default: false,
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
    timeStamps: true,
  }
);
const touristAccount = mongoose.model("touristAccounts", touristAccountSchema);
module.exports = touristAccount;
