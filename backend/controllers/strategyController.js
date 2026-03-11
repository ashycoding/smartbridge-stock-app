const Stock = require("../models/Stock");

const simulateStrategy = async (req, res) => {
  try {
    const { stockId, investmentAmount, days } = req.body;

    if (!stockId || !investmentAmount || !days) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const stock = await Stock.findById(stockId);

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    if (stock.priceHistory.length < 2) {
      return res.status(400).json({ message: "Not enough price history" });
    }

    const prices = stock.priceHistory.slice(-10).map(p => p.price);

    const first = prices[0];
    const last = prices[prices.length - 1];

    const trendPercent = ((last - first) / first) * 100;

    let simulatedValue = investmentAmount;
    const dailyGrowth = (trendPercent / 100) / 10;

    const projection = [];

    for (let day = 1; day <= days; day++) {
      simulatedValue += simulatedValue * dailyGrowth;

      projection.push({
        day,
        value: parseFloat(simulatedValue.toFixed(2)),
      });
    }

    res.status(200).json({
      initialInvestment: investmentAmount,
      trendPercent: trendPercent.toFixed(2),
      projectedValue: simulatedValue.toFixed(2),
      profit: (simulatedValue - investmentAmount).toFixed(2),
      projection,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { simulateStrategy };