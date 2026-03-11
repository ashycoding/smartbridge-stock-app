import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "https://smartbridge-backend-pcfd.onrender.com/api/users/login",
        { email, password }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("balance", res.data.balance);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        .login-root {
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

        .login-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 40%, rgba(78,204,163,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 15% 15%, rgba(96,165,250,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 85% 85%, rgba(167,139,250,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .login-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Card */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 400px;
          background: rgba(255,255,255,0.028);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 2.4rem 2.2rem;
          backdrop-filter: blur(12px);
          box-shadow:
            0 0 0 1px rgba(78,204,163,0.05),
            0 40px 80px rgba(0,0,0,0.5);
        }

        /* Top glow line */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0; left: 12%; right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #4ecca3, transparent);
          border-radius: 0 0 100% 100%;
        }

        /* Logo mark */
        .login-logomark {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(78,204,163,0.1);
          border: 1px solid rgba(78,204,163,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .login-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #4ecca3;
          margin-bottom: 0.35rem;
          opacity: 0.8;
        }

        .login-title {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #e8eaf0;
          margin: 0 0 2rem;
          line-height: 1;
        }

        /* Input group */
        .input-group {
          margin-bottom: 1rem;
        }

        .input-label {
          display: block;
          font-family: 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 0.4rem;
        }

        .login-input {
          width: 100%;
          padding: 0.82rem 1rem;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 11px;
          color: #e8eaf0;
          font-family: 'Syne', sans-serif;
          font-size: 0.9rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, background 0.2s;
        }

        .login-input::placeholder {
          color: #1f2937;
        }

        .login-input:focus {
          border-color: rgba(78,204,163,0.35);
          background: rgba(78,204,163,0.03);
        }

        /* Error */
        .login-error {
          background: rgba(239,68,68,0.07);
          border: 1px solid rgba(239,68,68,0.18);
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          margin-bottom: 1rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #f87171;
          letter-spacing: 0.02em;
        }

        /* Button */
        .login-btn {
          width: 100%;
          padding: 0.9rem;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          box-shadow: 0 4px 20px rgba(16,185,129,0.25);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
          letter-spacing: 0.02em;
        }

        .login-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(16,185,129,0.4);
          filter: brightness(1.05);
        }

        .login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Spinner */
        .btn-spinner {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 0.5rem;
          vertical-align: middle;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Divider */
        .login-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 1.5rem 0;
        }

        /* Footer */
        .login-footer {
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: #374151;
          letter-spacing: 0.03em;
        }

        .login-footer a {
          color: #4ecca3;
          text-decoration: none;
          font-weight: 700;
          transition: opacity 0.15s;
        }

        .login-footer a:hover {
          opacity: 0.75;
        }
      `}</style>

      <div className="login-root">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Logo mark */}
          <div className="login-logomark">📈</div>

          <p className="login-eyebrow">Welcome back</p>
          <h2 className="login-title">Sign In</h2>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="login-input"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="login-input"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="login-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Button */}
          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading && <span className="btn-spinner" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="login-divider" />

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/signup">Create one</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Login;