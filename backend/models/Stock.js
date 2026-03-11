const mongoose = require("mongoose");

const priceHistorySchema = mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  price: {
    type: Number,
    required: true,
  },
});

const stockSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    volume: {
      type: Number,
      default: 0,
    },
    priceHistory: [priceHistorySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Stock", stockSchema);