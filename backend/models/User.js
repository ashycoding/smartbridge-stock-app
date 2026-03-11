const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    balance: {
      type: Number,
      default: 100000, // virtual money
    },
    holdings: [
    {
        stock: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
        },
        quantity: {
        type: Number,
        default: 0,
        },
    },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);