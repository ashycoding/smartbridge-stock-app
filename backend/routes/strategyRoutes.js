const express = require("express");
const { simulateStrategy } = require("../controllers/strategyController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/simulate", protect, simulateStrategy);

module.exports = router;