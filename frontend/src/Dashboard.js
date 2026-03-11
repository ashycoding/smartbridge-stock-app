import React, { useEffect, useState } from "react";
import axios from "axios";
import CandlestickChart from "./CandlestickChart";
import CountUp from "react-countup";
import { motion } from "framer-motion";

function Dashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [balance, setBalance] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const portfolioRes = await axios.get(
          "https://smartbridge-backend-pcfd.onrender.com/api/portfolio",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const holdings = portfolioRes.data || [];
        setPortfolio(holdings);

        let value = 0;
        let invested = 0;

        holdings.forEach((item) => {
          const current = item.stock.currentPrice;
          const qty = item.quantity;
          const avg = item.averagePrice || current;
          value += current * qty;
          invested += avg * qty;
        });

        setTotalValue(value);
        setTotalInvested(invested);

        const userRes = await axios.get(
          "https://smartbridge-backend-pcfd.onrender.com/api/users/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setBalance(userRes.data.balance);
      } catch (error) {
        console.error("Dashboard error:", error);
      }
    };

    fetchData();
  }, []);

  const totalProfit = totalValue - totalInvested;
  const profitPercent =
    totalInvested > 0
      ? ((totalProfit / totalInvested) * 100).toFixed(2)
      : 0;
  const isGain = totalProfit >= 0;

  const summaryCards = [
    {
      label: "Available Balance",
      value: balance,
      prefix: "₹",
      color: "#fbbf24",
      border: "rgba(251,191,36,0.18)",
      bg: "rgba(251,191,36,0.05)",
      accent: "#fbbf24",
      dot: "#fbbf24",
      countUp: false,
    },
    {
      label: "Portfolio Value",
      value: totalValue,
      prefix: "₹",
      color: "#4ecca3",
      border: "rgba(78,204,163,0.18)",
      bg: "rgba(78,204,163,0.05)",
      accent: "#4ecca3",
      dot: "#4ecca3",
      countUp: true,
    },
    {
      label: "Total Invested",
      value: totalInvested,
      prefix: "₹",
      color: "#60a5fa",
      border: "rgba(96,165,250,0.18)",
      bg: "rgba(96,165,250,0.05)",
      accent: "#60a5fa",
      dot: "#60a5fa",
      countUp: true,
    },
    {
      label: "Total P / L",
      value: totalProfit,
      prefix: isGain ? "+₹" : "-₹",
      suffix: ` (${Math.abs(profitPercent)}%)`,
      color: isGain ? "#4ecca3" : "#f87171",
      border: isGain ? "rgba(78,204,163,0.18)" : "rgba(248,113,113,0.18)",
      bg: isGain ? "rgba(78,204,163,0.05)" : "rgba(248,113,113,0.05)",
      accent: isGain ? "#4ecca3" : "#f87171",
      dot: isGain ? "#4ecca3" : "#f87171",
      countUp: false,
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        .dash-root {
          min-height: 100vh;
          background: #080c12;
          color: #e8eaf0;
          padding: 2.5rem 2rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .dash-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 35% at 80% 5%, rgba(78,204,163,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 30% at 5% 85%, rgba(96,165,250,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .dash-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .dash-content {
          position: relative;
          z-index: 1;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Header */
        .dash-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4ecca3;
          margin-bottom: 0.4rem;
          opacity: 0.8;
        }

        .dash-title {
          font-size: clamp(1.9rem, 4vw, 2.9rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0 0 2.2rem;
          background: linear-gradient(135deg, #e8eaf0 40%, #4ecca3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Summary Cards */
        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 2.5rem;
        }

        .summary-card {
          border-radius: 18px;
          padding: 1.5rem 1.6rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.22s, box-shadow 0.22s;
        }

        .summary-card:hover {
          transform: translateY(-3px);
        }

        .summary-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          border-radius: 0 0 100% 100%;
        }

        .summary-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 0.8rem;
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }

        .summary-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .summary-value {
          font-size: 1.55rem;
          font-weight: 700;
          line-height: 1;
        }

        /* Charts Section */
        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .section-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.05);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
          gap: 1.2rem;
        }

        /* Stock Card */
        .stock-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 1.5rem;
          transition: border-color 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
        }

        .stock-card:hover {
          border-color: rgba(78,204,163,0.2);
          box-shadow: 0 12px 40px rgba(78,204,163,0.06);
        }

        .stock-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.2rem;
        }

        .stock-symbol {
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #e8eaf0;
        }

        .stock-pl-badge {
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 0.25rem 0.65rem;
          border-radius: 7px;
          border: 1px solid;
        }

        .stock-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          margin-top: 1.1rem;
        }

        .meta-item {
          background: rgba(255,255,255,0.03);
          border-radius: 10px;
          padding: 0.65rem 0.8rem;
        }

        .meta-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 0.3rem;
        }

        .meta-value {
          font-family: 'Space Mono', monospace;
          font-size: 0.8rem;
          color: #9ca3af;
        }

        /* Empty state */
        .empty-state {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 4rem 2rem;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.08em;
          color: #1f2937;
        }
      `}</style>

      <div className="dash-root">
        <div className="dash-content">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="dash-eyebrow">Live Overview</p>
            <h1 className="dash-title">Portfolio Dashboard</h1>
          </motion.div>

          {/* Summary Cards */}
          <div className="summary-grid">
            {summaryCards.map((card, i) => (
              <motion.div
                key={i}
                className="summary-card"
                style={{
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0, left: "10%", right: "10%",
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`,
                    borderRadius: "0 0 100% 100%",
                  }}
                />
                <p className="summary-label">
                  <span
                    className="summary-dot"
                    style={{ background: card.dot, boxShadow: `0 0 5px ${card.dot}` }}
                  />
                  {card.label}
                </p>
                <div className="summary-value" style={{ color: card.color }}>
                  {card.countUp ? (
                    <CountUp end={card.value} duration={1.5} prefix={card.prefix} decimals={2} />
                  ) : (
                    `${card.prefix}${Math.abs(card.value).toFixed(2)}${card.suffix || ""}`
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <p className="section-label">Holdings</p>

          {portfolio.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No stocks yet — head to the Trade panel to buy some.
            </motion.div>
          ) : (
            <div className="charts-grid">
              {portfolio.map((item, index) => {
                const current = item.stock.currentPrice;
                const qty = item.quantity;
                const avg = item.averagePrice || current;
                const invested = avg * qty;
                const value = current * qty;
                const profit = value - invested;
                const percent =
                  invested > 0 ? ((profit / invested) * 100).toFixed(2) : 0;
                const cardGain = profit >= 0;

                return (
                  <motion.div
                    key={item.stock._id}
                    className="stock-card"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
                  >
                    {/* Card Header */}
                    <div className="stock-card-header">
                      <span className="stock-symbol">{item.stock.symbol}</span>
                      <span
                        className="stock-pl-badge"
                        style={{
                          background: cardGain ? "rgba(78,204,163,0.1)" : "rgba(248,113,113,0.1)",
                          borderColor: cardGain ? "rgba(78,204,163,0.25)" : "rgba(248,113,113,0.22)",
                          color: cardGain ? "#4ecca3" : "#f87171",
                        }}
                      >
                        {cardGain ? "+" : ""}{percent}%
                      </span>
                    </div>

                    {/* Chart */}
                    <CandlestickChart symbol={item.stock.symbol} />

                    {/* Meta Row */}
                    <div className="stock-meta">
                      <div className="meta-item">
                        <p className="meta-label">Quantity</p>
                        <p className="meta-value">{qty}</p>
                      </div>
                      <div className="meta-item">
                        <p className="meta-label">Avg Buy</p>
                        <p className="meta-value">₹{avg.toFixed(2)}</p>
                      </div>
                      <div className="meta-item">
                        <p className="meta-label">Current</p>
                        <p className="meta-value">₹{current.toFixed(2)}</p>
                      </div>
                    </div>

                    {/* P/L row */}
                    <div style={{
                      marginTop: "0.8rem",
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: cardGain ? "#4ecca3" : "#f87171",
                    }}>
                      P/L: {cardGain ? "+" : ""}₹{profit.toFixed(2)}
                      <span style={{ color: "#374151", fontWeight: 400, marginLeft: "0.5rem" }}>
                        ({cardGain ? "+" : ""}{percent}%)
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Dashboard;