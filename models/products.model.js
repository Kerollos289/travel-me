const { Archive } = require("lucide-react");
const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    picture: {
      type: String,
      required: [true, "A product picture is required"],
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    ratings: {
      type: Number,
      default: 0, // Default rating is 0
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },
    reviews: {
      type: [String], // Array of strings for reviews
      default: [],
    },
    quantity: {
      type: Number,
    },
    archived: {
      type: Boolean,
      default: false,
    },
    seller: {
      username: {
        type: String,
        required: [true, "Seller username is required"],
      },
      sellerType: {
        type: String,
        required: [true, "Seller type is required"],
        enum: ["Admin", "Seller"], // Must be either 'Admin' or 'Seller'
      },
    },
    numberOfSales: {
      type: Number,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Product", productSchema);
