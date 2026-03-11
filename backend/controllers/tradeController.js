const User = require("../models/User");
const Stock = require("../models/Stock");
const Transaction = require("../models/Transaction");
const { fetchStockPrice } = require("../services/stockService");

// BUY STOCK
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const user = await User.findById(req.user._id);
    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Fetch latest market price
    const marketData = await fetchStockPrice(stock.symbol);
    const latestPrice = marketData.price;

    const totalCost = latestPrice * quantity;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct balance
    user.balance -= totalCost;
    // Ensure holdings array exists
    if (!user.holdings) {
      user.holdings = [];
    }
    // Update holdings
    const existingHolding = user.holdings.find(
      (h) => h.stock.toString() === stockId
    );

    if (existingHolding) {
      existingHolding.quantity += quantity;
    } else {
      user.holdings.push({ stock: stockId, quantity });
    }

    await user.save();

    // Update stock price + history
    stock.currentPrice = latestPrice;
    stock.priceHistory.push({ price: latestPrice });
    await stock.save();

    // Create transaction
    await Transaction.create({
      user: user._id,
      stock: stockId,
      type: "buy",
      quantity,
      priceAtTrade: latestPrice,
      totalAmount: totalCost,
    });

    res.status(200).json({
      message: "Stock purchased successfully",
      balance: user.balance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;

    if (!stockId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const user = await User.findById(req.user._id);
    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    if (!user.holdings) {
      return res.status(400).json({ message: "No holdings found" });
    }

    const existingHolding = user.holdings.find(
      (h) => h.stock.toString() === stockId
    );

    if (!existingHolding || existingHolding.quantity < quantity) {
      return res.status(400).json({ message: "Not enough shares to sell" });
    }

    // Fetch latest price
    const marketData = await fetchStockPrice(stock.symbol);
    const latestPrice = marketData.price;

    const totalAmount = latestPrice * quantity;

    // Increase balance
    user.balance += totalAmount;

    // Reduce holdings
    existingHolding.quantity -= quantity;

    // Remove holding if zero
    if (existingHolding.quantity === 0) {
      user.holdings = user.holdings.filter(
        (h) => h.stock.toString() !== stockId
      );
    }

    await user.save();

    // Update stock price history
    stock.currentPrice = latestPrice;
    stock.priceHistory.push({ price: latestPrice });
    await stock.save();

    // Create transaction
    await Transaction.create({
      user: user._id,
      stock: stockId,
      type: "sell",
      quantity,
      priceAtTrade: latestPrice,
      totalAmount,
    });

    res.status(200).json({
      message: "Stock sold successfully",
      balance: user.balance,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// GET TRADE HISTORY
const getTradeHistory = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(transactions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { buyStock, sellStock, getTradeHistory };