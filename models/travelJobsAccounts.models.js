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
