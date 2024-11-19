const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema(
  {
    tourGuideUsername: {
      type: String, // Change this to String instead of ObjectId
      required: true,
    },
    itineraryName: {
      type: String,
      required: true,
    },
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "touristAccounts",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Rating = mongoose.model("Rating", ratingSchema);

module.exports = Rating;
