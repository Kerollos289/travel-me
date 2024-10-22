const mongoose = require("mongoose");

const tourismGovernorSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Enter a username"],
      unique: true, // Ensure that each username is unique
    },
    password: {
      type: String,
      required: [true, "Enter a password"],
    },
    type: {
      type: String,
      default: "tourismGoverner",
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);

const TourismGovernor = mongoose.model(
  "TourismGovernor",
  tourismGovernorSchema
);

module.exports = TourismGovernor;
