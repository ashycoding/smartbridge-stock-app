const express = require("express");
const {
  createStock,
  getStocks,
  getStockById,
  getStockCandles
} = require("../controllers/stockController");

const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Create & list stocks
router.route("/")
  .post(protect, admin, createStock)
  .get(protect, getStocks);

// 🔥 CANDLE ROUTE FIRST
router.get("/candles/:symbol", protect, getStockCandles);

// 🔥 THEN :id route
router.route("/:id")
  .get(protect, getStockById);

module.exports = router;