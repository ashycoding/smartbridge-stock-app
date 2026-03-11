const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Middleware FIRST
app.use(cors());
app.use(express.json());

// Routes AFTER middleware
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);
const stockRoutes = require("./routes/stockRoutes");
app.use("/api/stocks", stockRoutes);
const tradeRoutes = require("./routes/tradeRoutes");
app.use("/api/trade", tradeRoutes);
const aiRoutes = require("./routes/aiRoutes");
app.use("/api/ai", aiRoutes);
const portfolioRoutes = require("./routes/portfolioRoutes");
app.use("/api/portfolio", portfolioRoutes);
const strategyRoutes = require("./routes/strategyRoutes");
app.use("/api/strategy", strategyRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});