const { type } = require("@testing-library/user-event/dist/type");
const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  roomType: {
    type: String, // e.g. 'Single', 'Double', 'Suite'
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  checkInDate: {
    type: Date, // Use Date type for better handling of dates
    required: true,
  },
  checkOutDate: {
    type: Date, // Use Date type for better handling of dates
    required: true,
  },
  // Additional hotel details as required
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
