import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      await axios.post(
        "https://smartbridge-stock-app-backend.onrender.com/api/users/register",
        { name, email, password }
      );
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignup();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@500;600;700;800&display=swap');

        .signup-root {
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

        .signup-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 60% at 50% 40%, rgba(96,165,250,0.05) 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 85% 15%, rgba(78,204,163,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 10% 85%, rgba(167,139,250,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .signup-root::after {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .signup-card {
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
            0 0 0 1px rgba(96,165,250,0.05),
            0 40px 80px rgba(0,0,0,0.5);
        }

        .signup-card::before {
          content: '';
          position: absolute;
          top: 0; left: 12%; right: 12%;
          height: 1px;
          background: linear-gradient(90deg, transparent, #60a5fa, transparent);
          border-radius: 0 0 100% 100%;
        }

        .signup-logomark {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: rgba(96,165,250,0.1);
          border: 1px solid rgba(96,165,250,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .signup-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #60a5fa;
          margin-bottom: 0.35rem;
          opacity: 0.8;
        }

        .signup-title {
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: #e8eaf0;
          margin: 0 0 2rem;
          line-height: 1;
        }

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

        .signup-input {
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

        .signup-input::placeholder {
          color: #1f2937;
        }

        .signup-input:focus {
          border-color: rgba(96,165,250,0.35);
          background: rgba(96,165,250,0.03);
        }

        /* Password strength bar */
        .strength-bar-wrap {
          margin-top: 0.5rem;
          height: 3px;
          background: rgba(255,255,255,0.06);
          border-radius: 99px;
          overflow: hidden;
        }

        .strength-bar-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 0.3s, background 0.3s;
        }

        .strength-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 0.08em;
          margin-top: 0.3rem;
          text-transform: uppercase;
        }

        /* Error / Success */
        .signup-error {
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

        .signup-success {
          background: rgba(78,204,163,0.07);
          border: 1px solid rgba(78,204,163,0.2);
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          margin-bottom: 1rem;
          font-family: 'Space Mono', monospace;
          font-size: 0.7rem;
          color: #4ecca3;
          letter-spacing: 0.02em;
        }

        /* Button */
        .signup-btn {
          width: 100%;
          padding: 0.9rem;
          border-radius: 12px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff;
          box-shadow: 0 4px 20px rgba(59,130,246,0.25);
          transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
        }

        .signup-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(59,130,246,0.4);
          filter: brightness(1.07);
        }

        .signup-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

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

        .signup-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin: 1.5rem 0;
        }

        .signup-footer {
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 0.68rem;
          color: #374151;
          letter-spacing: 0.03em;
        }

        .signup-footer a {
          color: #4ecca3;
          text-decoration: none;
          font-weight: 700;
          transition: opacity 0.15s;
        }

        .signup-footer a:hover {
          opacity: 0.75;
        }
      `}</style>

      <div className="signup-root">
        <motion.div
          className="signup-card"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {/* Logo mark */}
          <div className="signup-logomark">🚀</div>

          <p className="signup-eyebrow">Get started</p>
          <h2 className="signup-title">Create Account</h2>

          {/* Full Name */}
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="signup-input"
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="signup-input"
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
              className="signup-input"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {/* Strength indicator */}
            {password.length > 0 && (() => {
              const strength =
                password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
                  ? { w: "100%", color: "#4ecca3", label: "Strong" }
                  : password.length >= 6
                  ? { w: "55%", color: "#fbbf24", label: "Fair" }
                  : { w: "25%", color: "#f87171", label: "Weak" };
              return (
                <>
                  <div className="strength-bar-wrap">
                    <div
                      className="strength-bar-fill"
                      style={{ width: strength.w, background: strength.color }}
                    />
                  </div>
                  <p className="strength-label" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </>
              );
            })()}
          </div>

          {/* Error */}
          {error && (
            <motion.div
              className="signup-error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          {/* Success */}
          {success && (
            <motion.div
              className="signup-success"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
            >
              ✓ Account created! Redirecting to login...
            </motion.div>
          )}

          {/* Button */}
          <button
            className="signup-btn"
            onClick={handleSignup}
            disabled={loading || success}
          >
            {loading && <span className="btn-spinner" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="signup-divider" />

          <p className="signup-footer">
            Already have an account?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}

export default Signup;