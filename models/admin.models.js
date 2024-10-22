const mongoose = require("mongoose");
const adminSchema = mongoose.Schema(
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
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
  }
);
const admin = mongoose.model("admin", adminSchema);
module.exports = admin;
