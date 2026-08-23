const mongoose = require("mongoose");

// Each product can be sold in multiple units (e.g. "Strip", "Packet", "Box"),
// each with its own price and stock. The top-level `price` and `stock`
// fields below are kept in sync automatically (price = default unit's price,
// stock = sum of all units' stock) so existing sorting/filtering/search on
// the product listing page keeps working without changes.
const unitSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true },
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    description: {
      type: String,
      required: true,
      minlength: 20,
    },
    // Summary/fallback fields — kept in sync with `units` by the controller.
    // price mirrors the default unit's price; stock mirrors the sum of all
    // unit stocks. Used for sorting, filtering, and quick display.
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value == null || value < this.price;
        },
        message: "discountPrice must be less than price",
      },
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr && arr.length >= 1;
        },
        message: "At least one product image is required",
      },
    },
    // Selling units (Strip, Packet, Box, etc.). At least one is required;
    // exactly one should have isDefault: true (enforced in the controller).
    units: {
      type: [unitSchema],
      validate: {
        validator: function (arr) {
          return arr && arr.length >= 1;
        },
        message: "At least one unit (e.g. Strip, Packet) is required",
      },
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Text index for ?search= support on name and description
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
