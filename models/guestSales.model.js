// guestSales.model.js
const mongoose = require("mongoose");

const guestSalesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  revenue: {
    type: Number,
    required: true,
  },
  myRate: {
    type: Number,
    default: function () {
      return this.revenue * 0.9; // Automatically calculate 90% of the revenue
    },
  },
}, { timestamps: true });

const GuestSales = mongoose.model("GuestSales", guestSalesSchema);

module.exports = GuestSales;