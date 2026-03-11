const express = require("express");
const { getSuggestions } = require("../controllers/aiController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/suggestions", protect, getSuggestions);

module.exports = router;