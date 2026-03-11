const express = require("express");
const {
  getPortfolio,
  predictPortfolio,
  exportPortfolioPDF
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getPortfolio);
router.get("/predict", protect, predictPortfolio);
router.get("/export", protect, exportPortfolioPDF);

module.exports = router;