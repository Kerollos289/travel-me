const mongoose = require("mongoose");

const activitySchema = mongoose.Schema(
  {
    advertiserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Advertiser",
      required: true, // Link the activity to an advertiser
    },
    date: {
      type: Date,
      required: [true, "Enter the activity date"],
    },
    time: {
      type: String,
      required: [true, "Enter the activity time"],
    },
    location: {
      type: String, // You can store latitude/longitude or address
      required: [true, "Enter the location"],
    },
    price: {
      type: Number, // You can also make this a range if needed
      required: [true, "Enter the price or price range"],
    },
    category: {
      type: String,
      required: [true, "Enter the category"],
    },
    tags: {
      type: [String], // Array of strings to store tags
    },
    specialDiscounts: {
      type: Boolean,
      default: false,
    },
    isBookingOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
