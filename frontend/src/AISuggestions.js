import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function AISuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          "https://smartbridge-stock-app-backend.onrender.com/api/ai/suggestions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuggestions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestions();
  }, []);

  const getConfig = (type) => {
    if (type === "BUY")
      return {
        bg: "rgba(16,185,129,0.08)",
        border: "rgba(16,185,129,0.2)",
        badgeBg: "rgba(16,185,129,0.15)",
        badgeBorder: "rgba(16,185,129,0.3)",
        badgeColor: "#4ecca3",
        glow: "rgba(16,185,129,0.12)",
        accent: "#4ecca3",
        icon: "↑",
      };
    if (type === "SELL")
      return {
        bg: "rgba(239,68,68,0.06)",
        border: "rgba(239,68,68,0.18)",
        badgeBg: "rgba(239,68,68,0.12)",
        badgeBorder: "rgba(239,68,68,0.25)",
        badgeColor: "#f87171",
        glow: "rgba(239,68,68,0.1)",
        accent: "#f87171",
        icon: "↓",
      };
    return {
      bg: "rgba(251,191,36,0.05)",
      border: "rgba(251,191,36,0.15)",
      badgeBg: "rgba(251,191,36,0.1)",
      badgeBorder: "rgba(251,191,36,0.22)",
      badgeColor: "#fbbf24",
      glow: "rgba(251,191,36,0.08)",
      accent: "#fbbf24",
      icon: "→",
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        .ai-root {
          min-height: 100vh;
          background: #080c12;
          color: #e8eaf0;
          padding: 2.5rem 2rem;
          font-family: 'Syne', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .ai-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 40% at 70% 10%, rgba(139,92,246,0.05) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 20% 80%, rgba(78,204,163,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .ai-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .ai-content {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header */
        .ai-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #a78bfa;
          margin-bottom: 0.45rem;
          opacity: 0.85;
        }

        .ai-title {
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          margin: 0 0 2.2rem;
          background: linear-gradient(135deg, #e8eaf0 40%, #a78bfa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Grid */
        .ai-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.2rem;
        }

        /* Card */
        .ai-card {
          border-radius: 20px;
          padding: 1.6rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.25s, box-shadow 0.25s;
          cursor: default;
        }

        .ai-card:hover {
          transform: translateY(-4px);
        }

        /* Shimmer line at top */
        .card-accent-line {
          position: absolute;
          top: 0; left: 12%; right: 12%;
          height: 1px;
          border-radius: 0 0 100% 100%;
        }

        /* Card header row */
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.1rem;
        }

        .card-symbol {
          font-size: 1.35rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #e8eaf0;
        }

        /* Badge */
        .card-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.3rem 0.75rem;
          border-radius: 8px;
          font-family: 'Space Mono', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          border: 1px solid;
        }

        .badge-icon {
          font-size: 0.85rem;
          line-height: 1;
        }

        /* Divider */
        .card-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin-bottom: 1rem;
        }

        /* Reason text */
        .card-reason {
          font-size: 0.85rem;
          line-height: 1.65;
          color: #6b7280;
        }

        /* AI label */
        .card-footer {
          margin-top: 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .ai-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #374151;
        }

        .ai-pulse {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #a78bfa;
          animation: pulse-anim 2s infinite;
        }

        @keyframes pulse-anim {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(167,139,250,0.4); }
          50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(167,139,250,0); }
        }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: #1f2937;
        }
      `}</style>

      <div className="ai-root">
        <div className="ai-content">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            <p className="ai-eyebrow">Powered by AI</p>
            <h1 className="ai-title">Stock Suggestions</h1>
          </motion.div>

          {/* Grid */}
          <div className="ai-grid">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                const cfg = getConfig(item.suggestion);
                return (
                  <motion.div
                    key={index}
                    className="ai-card"
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      boxShadow: `0 8px 32px ${cfg.glow}`,
                    }}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08, duration: 0.4 }}
                    whileHover={{
                      boxShadow: `0 16px 48px ${cfg.glow}, 0 0 0 1px ${cfg.border}`,
                    }}
                  >
                    {/* Top accent line */}
                    <div
                      className="card-accent-line"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${cfg.accent}, transparent)`,
                      }}
                    />

                    {/* Header */}
                    <div className="card-header">
                      <span className="card-symbol">{item.symbol}</span>
                      <span
                        className="card-badge"
                        style={{
                          background: cfg.badgeBg,
                          borderColor: cfg.badgeBorder,
                          color: cfg.badgeColor,
                        }}
                      >
                        <span className="badge-icon">{cfg.icon}</span>
                        {item.suggestion}
                      </span>
                    </div>

                    <div className="card-divider" />

                    {/* Reason */}
                    <p className="card-reason">{item.reason}</p>

                    {/* Footer */}
                    <div className="card-footer">
                      <div className="ai-pulse" />
                      <span className="ai-label">AI Analysis</span>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="empty-state">Fetching AI suggestions...</div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}

export default AISuggestions;