const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");
const Stock = require("../models/Stock");

const predictPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("holdings.stock");

    let currentValue = 0;

    for (let holding of user.holdings) {
      const stock = holding.stock;
      currentValue += stock.currentPrice * holding.quantity;
    }

    // Calculate average trend from holdings
    let avgTrendPercent = 0;
    let count = 0;

    for (let holding of user.holdings) {
      const stock = holding.stock;

      if (stock.priceHistory.length >= 2) {
        const prices = stock.priceHistory.slice(-5).map(p => p.price);
        const first = prices[0];
        const last = prices[prices.length - 1];
        const percentChange = ((last - first) / first) * 100;

        avgTrendPercent += percentChange;
        count++;
      }
    }

    avgTrendPercent = count > 0 ? avgTrendPercent / count : 0;

    // Generate 7 day prediction
    const prediction = [];
    let simulatedValue = currentValue;

    for (let day = 1; day <= 7; day++) {
      simulatedValue += simulatedValue * (avgTrendPercent / 100) / 5;
      prediction.push({
        day,
        value: parseFloat(simulatedValue.toFixed(2)),
      });
    }

    res.status(200).json({
      currentValue: parseFloat(currentValue.toFixed(2)),
      avgTrendPercent: avgTrendPercent.toFixed(2),
      prediction,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const exportPortfolioPDF = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("holdings.stock");

    const doc = new PDFDocument();
    const fileName = `portfolio_${user._id}.pdf`;
    const filePath = path.join(__dirname, `../${fileName}`);

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(20).text("Stock Trading Portfolio Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.text(`Balance: ₹${user.balance.toFixed(2)}`);
    doc.moveDown();

    let totalValue = 0;

    doc.fontSize(16).text("Holdings:");
    doc.moveDown();

    user.holdings.forEach((holding) => {
      const stock = holding.stock;
      const value = stock.currentPrice * holding.quantity;
      totalValue += value;

      doc.fontSize(12).text(
        `${stock.symbol} | Qty: ${holding.quantity} | Price: ₹${stock.currentPrice} | Value: ₹${value.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total Portfolio Value: ₹${totalValue.toFixed(2)}`);

    doc.moveDown();
    doc.text(`Generated on: ${new Date().toLocaleString()}`);

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, fileName, () => {
        fs.unlinkSync(filePath); // delete after download
      });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("holdings.stock");

    res.status(200).json(user.holdings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { predictPortfolio, exportPortfolioPDF, getPortfolio };