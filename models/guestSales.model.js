// guestSales.model.js
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
  date: {
    type: Date,
    default: Date.now, // Defaults to current date if not provided
  },
  month: {
    type: Number,
    default: function () {
      return this.date.getMonth() + 1; // Get the month (1-12)
    },
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
