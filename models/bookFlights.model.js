const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tourist",
    required: true,
  },
  airline: { type: String, required: true },
  flightNumber1: { type: String, required: true },
  departure1: { type: Date, required: true },
  arrival1: { type: Date, required: true },
  flightNumber2: { type: String },
  departure2: { type: Date },
  arrival2: { type: Date },
  price: { type: Number, required: true },
  currency: { type: String, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: "Booked" }, // Options: 'Booked', 'Cancelled', etc.
});

module.exports = mongoose.model("Booking", bookingSchema);
