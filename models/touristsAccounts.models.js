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
  },

  {
    timeStamps: true,
  }
);
const touristAccount = mongoose.model("touristAccounts", touristAccountSchema);
module.exports = touristAccount;
