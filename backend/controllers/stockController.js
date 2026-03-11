const Stock = require("../models/Stock");
const { fetchStockPrice } = require("../services/stockService");

// @desc    Create stock (Admin)
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = async (req, res) => {
  try {
    const { name, symbol } = req.body;

    if (!name || !symbol) {
      return res.status(400).json({ message: "Name and symbol are required" });
    }

    const formattedSymbol = symbol.toUpperCase();

    // Check if already exists
    const stockExists = await Stock.findOne({ symbol: formattedSymbol });
    if (stockExists) {
      return res.status(400).json({ message: "Stock already exists" });
    }

    // Fetch live price from Finnhub
    const marketData = await fetchStockPrice(formattedSymbol);

    const stock = await Stock.create({
      name,
      symbol: formattedSymbol,
      currentPrice: marketData.price,
      volume: marketData.volume,
      priceHistory: [
        {
          price: marketData.price,
        },
      ],
    });

    res.status(201).json(stock);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stocks
// @route   GET /api/stocks
// @access  Private
const getStocks = async (req, res) => {
  try {
    const stocks = await Stock.find();
    res.status(200).json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single stock
// @route   GET /api/stocks/:id
// @access  Private
const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const axios = require("axios");

const getStockCandles = async (req, res) => {
  try {
    const { symbol } = req.params;

    const stock = await Stock.findOne({ symbol });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    const days = 30;
    const candles = [];

    let lastClose = stock.currentPrice;

    for (let i = 0; i < days; i++) {
      const open = lastClose;

      // simulate movement ±3%
      const changePercent = (Math.random() * 6 - 3) / 100;
      const close = open + open * changePercent;

      const high = Math.max(open, close) + open * 0.01 * Math.random();
      const low = Math.min(open, close) - open * 0.01 * Math.random();

      candles.push({
        day: i + 1,
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
      });

      lastClose = close;
    }

    res.json(candles);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStock,
  getStocks,
  getStockById,
  getStockCandles,
};