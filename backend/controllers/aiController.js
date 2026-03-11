const Stock = require("../models/Stock");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const getSuggestions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("holdings.stock");
    const stocks = await Stock.find();

    const suggestions = [];

    for (let stock of stocks) {

      if (stock.priceHistory.length < 2) continue;

      const prices = stock.priceHistory.slice(-5).map(p => p.price);

      const first = prices[0];
      const last = prices[prices.length - 1];

      const percentChange = ((last - first) / first) * 100;

      const holding = user.holdings.find(
        h => h.stock._id.toString() === stock._id.toString()
      );

      // Calculate average buy price if holding
      let avgBuyPrice = 0;

      if (holding) {
        const userBuys = await Transaction.find({
          user: user._id,
          stock: stock._id,
          type: "buy"
        });

        const totalSpent = userBuys.reduce((sum, t) => sum + t.totalAmount, 0);
        const totalQty = userBuys.reduce((sum, t) => sum + t.quantity, 0);

        avgBuyPrice = totalQty > 0 ? totalSpent / totalQty : 0;
      }

      if (percentChange > 3 && !holding) {
        suggestions.push({
          symbol: stock.symbol,
          suggestion: "BUY",
          reason: `Uptrend of ${percentChange.toFixed(2)}% detected`
        });
      }

      else if (holding && (last < avgBuyPrice * 0.95 || percentChange < -3)) {
        suggestions.push({
          symbol: stock.symbol,
          suggestion: "SELL",
          reason: "Downtrend or 5% loss detected"
        });
      }

      else {
        suggestions.push({
          symbol: stock.symbol,
          suggestion: "HOLD",
          reason: "Stable movement"
        });
      }
    }

    res.status(200).json(suggestions);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSuggestions };