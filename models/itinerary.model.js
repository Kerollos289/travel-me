//itinerary.model.js
const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  activities: {
    type: String, // Changed to String
    required: true,
  },
  duration: {
    type: String, // Changed to String
    required: true,
  },
  locationsToVisit: {
    type: [String], // Keep as an array of strings
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  availableDates: {
    type: [String], // Keep as an array of strings
    required: true,
  },
  accessibility: {
    type: String,
    required: false,
  },
  pickupLocation: {
    type: String,
    required: false,
  },
  dropOffLocation: {
    type: String,
    required: false,
  },
  language: {
    type: String,
    required: false,
  },
}, { timestamps: true });

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

module.exports = Itinerary;