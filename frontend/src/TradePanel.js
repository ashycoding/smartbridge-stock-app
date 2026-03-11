import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";

function TradePanel() {
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [balance, setBalance] = useState(
    Number(localStorage.getItem("balance")) || 0
  );

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStocks();
    fetchUser();
    fetchPortfolio();
  }, []);

  const fetchStocks = async () => {
    const res = await axios.get("https://smartbridge-backend-pcfd.onrender.com/api/stocks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setStocks(res.data);
  };

  const fetchUser = async () => {
    const res = await axios.get("https://smartbridge-backend-pcfd.onrender.com/api/users/current", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBalance(res.data.balance);
  };

  const fetchPortfolio = async () => {
    const res = await axios.get("https://smartbridge-backend-pcfd.onrender.com/api/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPortfolio(res.data || []);
  };

  const filteredStocks = stocks.filter((stock) =>
    stock.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const ownedQuantity =
    (selectedStock &&
      portfolio.find((p) => p.stock._id === selectedStock._id)?.quantity) ||
    0;

  const totalCost =
    selectedStock && quantity
      ? selectedStock.currentPrice * Number(quantity)
      : 0;

  const handleTrade = async (type) => {
    if (!selectedStock || !quantity) {
      toast.error("Select stock and quantity");
      return;
    }

    const qty = Number(quantity);

    if (type === "buy" && totalCost > balance) {
      toast.error("Insufficient balance");
      return;
    }

    if (type === "sell" && qty > ownedQuantity) {
      toast.error("You don't own enough shares");
      return;
    }

    try {
      const response = await axios.post(
        `https://smartbridge-backend-pcfd.onrender.com/api/trade/${type}`,
        { stockId: selectedStock._id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`${type.toUpperCase()} successful 🚀`);
      setBalance(response.data.balance);
      localStorage.setItem("balance", response.data.balance);
      setQuantity("");
      setSearch("");
      setSelectedStock(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Trade failed");
    }
  };

  const canAfford = !selectedStock || !quantity || totalCost <= balance;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        .trade-root {
          min-height: 100vh;
          background: #080c12;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .trade-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 55% 45% at 50% 50%, rgba(78, 204, 163, 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 20%, rgba(96, 165, 250, 0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Grid lines background */
        .trade-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .trade-card {
          background: rgba(255, 255, 255, 0.028);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2.2rem;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 1px rgba(78, 204, 163, 0.06),
            0 40px 80px rgba(0,0,0,0.5);
        }

        /* Top accent line */
        .trade-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4ecca3, transparent);
          border-radius: 0 0 100% 100%;
        }

        /* Header */
        .trade-header {
          margin-bottom: 1.8rem;
        }

        .trade-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4ecca3;
          margin-bottom: 0.4rem;
          opacity: 0.8;
        }

        .trade-title {
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #e8eaf0;
          margin: 0;
          line-height: 1;
        }

        /* Balance badge */
        .balance-badge {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: rgba(250, 204, 21, 0.07);
          border: 1px solid rgba(250, 204, 21, 0.15);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          margin-bottom: 1.5rem;
        }

        .balance-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #fbbf24;
          box-shadow: 0 0 6px #fbbf24;
          flex-shrink: 0;
        }

        .balance-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #92400e;
          color: #d97706;
        }

        .balance-value {
          font-family: 'Space Mono', monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: #fbbf24;
          margin-left: auto;
        }

        /* Inputs */
        .input-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 0.4rem;
          display: block;
        }

        .trade-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }

        .trade-input::placeholder {
          color: #374151;
        }

        .trade-input:focus {
          border-color: rgba(78, 204, 163, 0.35);
          background: rgba(78, 204, 163, 0.03);
        }

        .input-group {
          margin-bottom: 1rem;
          position: relative;
        }

        /* Dropdown */
        .dropdown {
          background: #0e1420;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          margin-top: 0.3rem;
          max-height: 160px;
          overflow-y: auto;
          position: absolute;
          left: 0; right: 0;
          z-index: 50;
          box-shadow: 0 16px 40px rgba(0,0,0,0.6);
        }

        .dropdown::-webkit-scrollbar { width: 3px; }
        .dropdown::-webkit-scrollbar-track { background: transparent; }
        .dropdown::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

        .dropdown-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 1rem;
          cursor: pointer;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
        }

        .dropdown-item:last-child { border-bottom: none; }

        .dropdown-item:hover {
          background: rgba(78, 204, 163, 0.07);
        }

        .dropdown-symbol {
          font-weight: 700;
          font-size: 0.88rem;
          color: #e8eaf0;
        }

        .dropdown-price {
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          color: #4ecca3;
        }

        /* Stock info card */
        .stock-info {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          padding: 0.85rem 1rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
        }

        .stock-info-item {}

        .stock-info-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 0.25rem;
        }

        .stock-info-value {
          font-family: 'Space Mono', monospace;
          font-size: 0.9rem;
          color: #e8eaf0;
          font-weight: 700;
        }

        /* Order value */
        .order-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(96, 165, 250, 0.06);
          border: 1px solid rgba(96, 165, 250, 0.15);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          margin-bottom: 1.4rem;
        }

        .order-value-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3b82f6;
          opacity: 0.8;
        }

        .order-value-amount {
          font-family: 'Space Mono', monospace;
          font-size: 1rem;
          font-weight: 700;
          color: #60a5fa;
        }

        /* Insufficient warning */
        .insufficient {
          background: rgba(239, 68, 68, 0.06) !important;
          border-color: rgba(239, 68, 68, 0.2) !important;
        }
        .insufficient .order-value-label { color: #ef4444 !important; }
        .insufficient .order-value-amount { color: #f87171 !important; }

        /* Trade Buttons */
        .btn-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .trade-btn {
          padding: 0.9rem;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          position: relative;
          overflow: hidden;
        }

        .trade-btn:hover {
          transform: translateY(-1px);
        }

        .trade-btn:active {
          transform: translateY(0);
        }

        .btn-buy {
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.25);
        }

        .btn-buy:hover {
          box-shadow: 0 6px 28px rgba(16, 185, 129, 0.4);
          filter: brightness(1.05);
        }

        .btn-sell {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          color: #fff;
          box-shadow: 0 4px 20px rgba(239, 68, 68, 0.2);
        }

        .btn-sell:hover {
          box-shadow: 0 6px 28px rgba(239, 68, 68, 0.35);
          filter: brightness(1.05);
        }

        /* Toast override */
        .Toastify__toast {
          font-family: 'Syne', sans-serif !important;
          font-size: 0.85rem !important;
          background: #0e1420 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          color: #e8eaf0 !important;
          border-radius: 10px !important;
        }
      `}</style>

      <div className="trade-root">
        <ToastContainer theme="dark" position="top-right" />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="trade-card"
        >
          {/* Header */}
          <div className="trade-header">
            <p className="trade-eyebrow">Market Desk</p>
            <h2 className="trade-title">Trade Stock</h2>
          </div>

          {/* Balance */}
          <div className="balance-badge">
            <div className="balance-dot" />
            <span className="balance-label">Available Balance</span>
            <span className="balance-value">₹{balance.toFixed(2)}</span>
          </div>

          {/* Search */}
          <div className="input-group">
            <label className="input-label">Search Symbol</label>
            <input
              type="text"
              placeholder="e.g. AAPL, TSLA..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedStock(null);
              }}
              className="trade-input"
            />

            <AnimatePresence>
              {search && !selectedStock && filteredStocks.length > 0 && (
                <motion.div
                  className="dropdown"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.15 }}
                >
                  {filteredStocks.slice(0, 5).map((stock) => (
                    <div
                      key={stock._id}
                      className="dropdown-item"
                      onClick={() => {
                        setSelectedStock(stock);
                        setSearch(stock.symbol);
                      }}
                    >
                      <span className="dropdown-symbol">{stock.symbol}</span>
                      <span className="dropdown-price">₹{stock.currentPrice}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Stock Info */}
          <AnimatePresence>
            {selectedStock && (
              <motion.div
                className="stock-info"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="stock-info-item">
                  <p className="stock-info-label">Current Price</p>
                  <p className="stock-info-value">₹{selectedStock.currentPrice}</p>
                </div>
                <div className="stock-info-item" style={{ textAlign: "right" }}>
                  <p className="stock-info-label">You Own</p>
                  <p className="stock-info-value">{ownedQuantity} shares</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quantity */}
          <div className="input-group">
            <label className="input-label">Quantity</label>
            <input
              type="number"
              placeholder="Enter number of shares"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="trade-input"
            />
          </div>

          {/* Order Value */}
          <AnimatePresence>
            {selectedStock && quantity && (
              <motion.div
                className={`order-value ${!canAfford ? "insufficient" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="order-value-label">
                  {!canAfford ? "⚠ Insufficient Balance" : "Order Value"}
                </span>
                <span className="order-value-amount">₹{totalCost.toFixed(2)}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buttons */}
          <div className="btn-row">
            <button className="trade-btn btn-buy" onClick={() => handleTrade("buy")}>
              Buy
            </button>
            <button className="trade-btn btn-sell" onClick={() => handleTrade("sell")}>
              Sell
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default TradePanel;