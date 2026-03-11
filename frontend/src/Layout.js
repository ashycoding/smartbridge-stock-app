import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    to: "/",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: "/portfolio",
    label: "Portfolio",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    ),
  },
  {
    to: "/trade",
    label: "Trade",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    to: "/ai",
    label: "AI Suggestions",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
  },
];

function Layout({ children }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">T</div>
        <span className="logo-text">TradeX</span>
      </div>

      {/* Nav label */}
      <p className="nav-section-label">Navigation</p>

      {/* Nav links */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-link ${active ? "nav-link-active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {active && <span className="nav-active-dot" />}
            </Link>
          );
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        .layout-root {
          min-height: 100vh;
          background: #080c12;
          color: #e8eaf0;
          display: flex;
          font-family: 'Syne', sans-serif;
        }

        /* ── Sidebar ── */
        .sidebar {
          width: 230px;
          flex-shrink: 0;
          background: rgba(255,255,255,0.022);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: none;
          flex-direction: column;
          padding: 1.8rem 1.2rem;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 768px) {
          .sidebar { display: flex; }
        }

        /* Sidebar glow */
        .sidebar::after {
          content: '';
          position: absolute;
          top: 0; bottom: 0; right: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(78,204,163,0.15), transparent);
          pointer-events: none;
        }

        /* Logo */
        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 2.2rem;
          padding: 0 0.3rem;
        }

        .logo-mark {
          width: 32px; height: 32px;
          border-radius: 9px;
          background: linear-gradient(135deg, #059669, #10b981);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 0.9rem;
          color: #fff;
          box-shadow: 0 4px 14px rgba(16,185,129,0.35);
          flex-shrink: 0;
        }

        .logo-text {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #e8eaf0;
        }

        /* Nav section label */
        .nav-section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1f2937;
          margin-bottom: 0.6rem;
          padding: 0 0.5rem;
        }

        /* Nav links */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          font-size: 0.88rem;
          font-weight: 600;
          color: #4b5563;
          text-decoration: none;
          transition: background 0.18s, color 0.18s;
          position: relative;
        }

        .nav-link:hover {
          background: rgba(255,255,255,0.04);
          color: #9ca3af;
        }

        .nav-link-active {
          background: rgba(78,204,163,0.08) !important;
          color: #4ecca3 !important;
          border: 1px solid rgba(78,204,163,0.14);
        }

        .nav-icon {
          flex-shrink: 0;
          opacity: 0.7;
        }

        .nav-link-active .nav-icon {
          opacity: 1;
        }

        .nav-active-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #4ecca3;
          box-shadow: 0 0 5px #4ecca3;
          margin-left: auto;
        }

        /* Sidebar bottom */
        .sidebar-bottom {
          padding-top: 0.5rem;
        }

        .sidebar-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 1rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          width: 100%;
          padding: 0.65rem 0.75rem;
          border-radius: 10px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #374151;
          transition: background 0.18s, color 0.18s;
          text-align: left;
        }

        .logout-btn:hover {
          background: rgba(239,68,68,0.07);
          color: #f87171;
        }

        /* ── Mobile topbar ── */
        .mobile-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.2rem;
          background: rgba(255,255,255,0.022);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 40;
        }

        @media (min-width: 768px) {
          .mobile-topbar { display: none; }
        }

        .mobile-logo {
          display: flex;
          align-items: center;
          gap: 0.55rem;
        }

        .hamburger-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.45rem 0.6rem;
          cursor: pointer;
          color: #9ca3af;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }

        .hamburger-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #e8eaf0;
        }

        /* Mobile drawer */
        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 49;
          backdrop-filter: blur(4px);
        }

        .mobile-drawer {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 240px;
          background: #0b1018;
          border-right: 1px solid rgba(255,255,255,0.07);
          z-index: 50;
          display: flex;
          flex-direction: column;
          padding: 1.8rem 1.2rem;
        }

        /* Content area */
        .layout-content {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) {
          .layout-content {
            /* subtle grid overlay on content */
            background-image:
              linear-gradient(rgba(255,255,255,0.008) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.008) 1px, transparent 1px);
            background-size: 40px 40px;
          }
        }
      `}</style>

      <div className="layout-root">

        {/* Desktop Sidebar */}
        <aside className="sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile column: topbar + content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Mobile Topbar */}
          <div className="mobile-topbar">
            <div className="mobile-logo">
              <div className="logo-mark">T</div>
              <span className="logo-text">TradeX</span>
            </div>
            <button className="hamburger-btn" onClick={() => setMobileOpen(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mobile Drawer */}
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  className="mobile-overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileOpen(false)}
                />
                <motion.div
                  className="mobile-drawer"
                  initial={{ x: -260 }}
                  animate={{ x: 0 }}
                  exit={{ x: -260 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <SidebarContent />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Page Content */}
          <main className="layout-content">
            {children}
          </main>

        </div>
      </div>
    </>
  );
}

export default Layout;