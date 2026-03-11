import CountUp from "react-countup";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Portfolio() {
  const [profile, setProfile] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          "https://smartbridge-stock-app-backend.onrender.com/api/users/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const stockRes = await axios.get("https://smartbridge-stock-app-backend.onrender.com/api/stocks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const transactionRes = await axios.get(
          "https://smartbridge-stock-app-backend.onrender.com/api/trade/history",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setProfile(profileRes.data);
        setStocks(stockRes.data);
        setTransactions(transactionRes.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (!profile) return null;

  const getStockDetails = (stockId) => stocks.find((s) => s._id === stockId);

  const getAvgBuyPrice = (stockId) => {
    const buys = transactions.filter(
      (t) => t.stock === stockId && t.type === "buy"
    );
    if (buys.length === 0) return 0;
    const totalSpent = buys.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalQty = buys.reduce((sum, t) => sum + t.quantity, 0);
    return totalSpent / totalQty;
  };

  let totalValue = 0;
  let totalInvested = 0;

  // Pre-calculate for summary cards
  profile.holdings &&
    profile.holdings.forEach((holding) => {
      const stock = getStockDetails(holding.stock);
      if (!stock) return;
      const avgBuy = getAvgBuyPrice(holding.stock);
      totalInvested += avgBuy * holding.quantity;
      totalValue += stock.currentPrice * holding.quantity;
    });

  const totalPL = totalValue - totalInvested;
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;

  // Reset for table rendering
  let tableValue = 0;
  let tableInvested = 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');

        .portfolio-root {
          min-height: 100vh;
          background: #080c12;
          color: #e8eaf0;
          padding: 2.5rem 2rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .portfolio-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 80% 10%, rgba(0, 200, 150, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 10% 80%, rgba(0, 120, 255, 0.05) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        .portfolio-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .portfolio-header {
          display: flex;
          align-items: flex-end;
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .portfolio-title {
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, #e8eaf0 40%, #4ecca3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .portfolio-subtitle {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #4ecca3;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
          opacity: 0.8;
        }

        /* Summary Cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          padding: 1.4rem 1.6rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s;
        }

        .summary-card:hover {
          border-color: rgba(78, 204, 163, 0.25);
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent, #4ecca3);
          opacity: 0.6;
        }

        .summary-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 0.6rem;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--val-color, #e8eaf0);
          line-height: 1;
        }

        /* Table Container */
        .table-container {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          overflow: hidden;
        }

        .table-header-bar {
          padding: 1.2rem 1.8rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .table-header-bar span {
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #4ecca3;
          box-shadow: 0 0 6px #4ecca3;
        }

        .table-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.9rem;
        }

        thead tr {
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        thead th {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          padding: 1rem 1.5rem;
          text-align: left;
          font-weight: 400;
          white-space: nowrap;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.2s;
        }

        tbody tr:hover {
          background: rgba(78, 204, 163, 0.04);
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        tbody td {
          padding: 1.1rem 1.5rem;
          white-space: nowrap;
          font-family: 'Space Mono', monospace;
          font-size: 0.82rem;
          color: #c9cdd6;
        }

        .stock-symbol {
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #e8eaf0;
          letter-spacing: 0.02em;
        }

        .badge {
          display: inline-block;
          padding: 0.15rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .badge-gain {
          background: rgba(78, 204, 163, 0.12);
          color: #4ecca3;
          border: 1px solid rgba(78, 204, 163, 0.2);
        }

        .badge-loss {
          background: rgba(239, 68, 68, 0.1);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.18);
        }

        .text-gain { color: #4ecca3; }
        .text-loss { color: #f87171; }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #374151;
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
        }
      `}</style>

      <div className="portfolio-root">
        <div className="portfolio-content">

          {/* Header */}
          <motion.div
            className="portfolio-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="portfolio-subtitle">Investment Overview</p>
              <h1 className="portfolio-title">My Portfolio</h1>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <motion.div
            className="summary-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="summary-card" style={{ "--accent": "#60a5fa" }}>
              <p className="summary-label">Total Invested</p>
              <div className="summary-value" style={{ "--val-color": "#93c5fd" }}>
                <CountUp end={totalInvested} duration={1.5} prefix="₹" decimals={2} />
              </div>
            </div>

            <div className="summary-card" style={{ "--accent": "#4ecca3" }}>
              <p className="summary-label">Portfolio Value</p>
              <div className="summary-value" style={{ "--val-color": "#4ecca3" }}>
                <CountUp end={totalValue} duration={1.5} prefix="₹" decimals={2} />
              </div>
            </div>

            <div
              className="summary-card"
              style={{ "--accent": totalPL >= 0 ? "#4ecca3" : "#f87171" }}
            >
              <p className="summary-label">Total P/L</p>
              <div
                className="summary-value"
                style={{ "--val-color": totalPL >= 0 ? "#4ecca3" : "#f87171" }}
              >
                <CountUp
                  end={totalPL}
                  duration={1.5}
                  prefix={totalPL >= 0 ? "+₹" : "-₹"}
                  decimals={2}
                />
              </div>
            </div>

            <div
              className="summary-card"
              style={{ "--accent": totalPLPercent >= 0 ? "#4ecca3" : "#f87171" }}
            >
              <p className="summary-label">Return %</p>
              <div
                className="summary-value"
                style={{ "--val-color": totalPLPercent >= 0 ? "#4ecca3" : "#f87171" }}
              >
                <CountUp
                  end={totalPLPercent}
                  duration={1.5}
                  prefix={totalPLPercent >= 0 ? "+" : ""}
                  suffix="%"
                  decimals={2}
                />
              </div>
            </div>
          </motion.div>

          {/* Table */}
          <motion.div
            className="table-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="table-header-bar">
              <div className="dot" />
              <span>Holdings</span>
            </div>

            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Stock</th>
                    <th>Qty</th>
                    <th>Avg Buy</th>
                    <th>Current</th>
                    <th>Invested</th>
                    <th>Value</th>
                    <th>P / L</th>
                    <th>P / L %</th>
                  </tr>
                </thead>

                <tbody>
                  {profile.holdings && profile.holdings.length > 0 ? (
                    profile.holdings.map((holding, index) => {
                      const stock = getStockDetails(holding.stock);
                      if (!stock) return null;

                      const avgBuy = getAvgBuyPrice(holding.stock);
                      const invested = avgBuy * holding.quantity;
                      const value = stock.currentPrice * holding.quantity;
                      const profit = value - invested;
                      const profitPercent = (profit / invested) * 100;

                      tableValue += value;
                      tableInvested += invested;

                      const isGain = profit >= 0;

                      return (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.25 + index * 0.05 }}
                        >
                          <td>
                            <span className="stock-symbol">{stock.symbol}</span>
                          </td>
                          <td>{holding.quantity}</td>
                          <td>₹{avgBuy.toFixed(2)}</td>
                          <td>₹{stock.currentPrice}</td>
                          <td>₹{invested.toFixed(2)}</td>
                          <td>₹{value.toFixed(2)}</td>
                          <td>
                            <span className={`badge ${isGain ? "badge-gain" : "badge-loss"}`}>
                              {isGain ? "+" : ""}₹{profit.toFixed(2)}
                            </span>
                          </td>
                          <td className={isGain ? "text-gain" : "text-loss"}>
                            {isGain ? "+" : ""}{profitPercent.toFixed(2)}%
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8">
                        <div className="empty-state">No holdings yet</div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </>
  );
}

export default Portfolio;