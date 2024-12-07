const mongoose = require("mongoose");
const complaintSchema = mongoose.Schema(
  {
    title: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    body: {
      type: String,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    touristUsername: {
      type: String,
      ref: "touristAccounts", // Reference the touristAccounts model
      required: true,
    },
    reply: {
      type: String,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
module.exports = mongoose.model("Complaint", complaintSchema);
