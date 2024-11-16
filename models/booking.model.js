//booking.model.js
const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema(
  {
    touristId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tourist",
      required: false, // Link the booking to a tourist
    },
    type: {
      type: String,
      required: [true, "Enter the type of transportation (e.g., flight, train, bus)"],
    },
    dateTime: {
      type: Date,
      required: [true, "Enter the date and time of the booking"],
    },
    location: {
      type: String, // Store the location or starting point
      required: [true, "Enter the location"],
    },
    price: {
      type: Number,
      required: [true, "Enter the price of the booking"],
    },
    isBooked: {
      type: Boolean,
      default: false, // Indicates if the booking is reserved by a tourist
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
