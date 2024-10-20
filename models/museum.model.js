//museum.model.js
const mongoose = require("mongoose");

const museumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  pictures: {
    type: [String], // Array of strings for picture URLs
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  openingHours: {
    type: String,
    required: true,
  },
  foreignerTicketPrice: {
    type: Number,
    required: true,
  },
  studentTicketPrice: {
    type: Number,
    required: true,
  },
  nativeTicketPrice: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const Museum = mongoose.model("Museum", museumSchema);
module.exports = Museum;
