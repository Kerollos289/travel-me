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
    paidProduct: {
      type: [String],
      default: [],
      required: false,
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Reference to the Product model
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to the Product model
        },
        quantity: {
          type: Number,
          required: true,
          default: 1, // Start with a default quantity of 1
        },
      },
    ],
    addresses: {
      type: [
        {
          street: { type: String, required: true },
          city: { type: String, required: true },
          country: { type: String, required: true },
        },
      ],
      validate: [arrayLimit, "You can only store up to 3 addresses."],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);

// Custom validator for limiting the number of addresses to 3
function arrayLimit(val) {
  return val.length <= 3;
}

const touristAccount = mongoose.model("touristAccounts", touristAccountSchema);
module.exports = touristAccount;