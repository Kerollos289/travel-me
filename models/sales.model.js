//sales.model.js
const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["event", "itinerary", "sale"], // Allow only these three values
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  appRate: {
    type: Number,
    default: function () {
      return this.revenue * 0.1; // Automatically calculate 10% of the revenue
    },
  },
}, { timestamps: true });

const Sales = mongoose.model("Sales", salesSchema);

module.exports = Sales;
