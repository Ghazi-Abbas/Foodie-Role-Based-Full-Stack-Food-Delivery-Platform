import React, { useState } from "react";
import "./AuthDrawer.css";

export default function LoginDrawer({ close }) {

  const [accepted, setAccepted] = useState(false);

  const handleClose = () => {
    setAccepted(false);
    close();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-drawer">

        <span className="auth-close" onClick={handleClose}>✕</span>

        <h2 className="auth-title">Login</h2>
        <p className="auth-sub">
          or <span>Create an account</span>
        </p>

        <hr />

        <div className="auth-input">
          <input type="email" placeholder="Enter email" />
        </div>

        <div className="auth-input">
          <input type="password" placeholder="Enter password" />
        </div>

        <div className="auth-terms-box">
          <input
            type="checkbox"
            checked={accepted}
            onChange={() => setAccepted(!accepted)}
          />
          <label>
            I accept <b>Terms & Conditions</b> & <b>Privacy Policy</b>
          </label>
        </div>

        <button className="auth-btn" disabled={!accepted}>
          LOGIN
        </button>

      </div>
    </div>
  );
}
