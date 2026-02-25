import React, { useState } from "react";
import "./AuthDrawer.css";

export default function LoginDrawer({ close, openSignup }) {

  const [accepted, setAccepted] = useState(false);

  const handleClose = () => {
    setAccepted(false);
    close();       // <-- THIS CLOSES THE DRAWER
  };

  return (
    <div className="auth-overlay">
      <div className="auth-drawer">

        {/* CLOSE BUTTON */}
        <span className="auth-close" onClick={handleClose}>✕</span>

        {/* HEADER */}
        <h2 className="auth-title">Login</h2>

        <p className="auth-sub">
          or <span className="link" onClick={openSignup}>Create an account</span>
        </p>

        <hr />

        {/* INPUTS */}
        <div className="auth-input">
          <input type="email" placeholder="Enter email" />
        </div>

        <div className="auth-input">
          <input type="password" placeholder="Enter password" />
        </div>

        {/* TERMS */}
        <div className="auth-terms-box">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <label>
            I accept&nbsp;
            <a href="/terms" target="_blank">Terms & Conditions</a> &nbsp;and&nbsp;
            <a href="/privacy" target="_blank">Privacy Policy</a>
          </label>
        </div>

        {/* BUTTON */}
        <button className="auth-btn" disabled={!accepted}>
          LOGIN
        </button>

      </div>
    </div>
  );
}
