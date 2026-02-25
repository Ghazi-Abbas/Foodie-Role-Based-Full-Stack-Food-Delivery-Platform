import React from "react";
import "./Footer.css";
import { useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* BRAND */}
        <div onClick={() => navigate("")}>
          <img src="logo1.png" alt="Foodie" className="footer-logo" />
          <p className="footer-desc">
            Foodie helps you discover great food near you,
            from trusted local restaurants — delivered fast and fairly priced.
          </p>
        </div>

        {/* COMPANY */}
        <div>
          <h4>Company</h4>
          <ul>
            <li>About Foodie</li>
            <li>Careers</li>
            <li>Team</li>
            <li>Blog</li>
            <li>Press</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h4>Support</h4>
          <ul>
            <li>Help & Support</li>
            <li>Partner with us</li>
            <li>Delivery partner onboarding</li>
            <li>Report an issue</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* LEGAL */}
        <div>
          <h4>Legal</h4>
          <ul>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Refund & Cancellation</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>

      {/* CITIES */}
      <div className="footer-cities">
        <h4>We deliver to</h4>
        <p>
          Delhi • Mumbai • Bengaluru • Hyderabad • Chennai • Pune • Kolkata •
          Ahmedabad • Jaipur • Lucknow • Noida • Gurugram
        </p>
      </div>

      {/* SOCIAL + COPYRIGHT */}
      <div className="footer-bottom">
        <div className="socials">
          <span>in</span>
          <span>ig</span>
          <span>fb</span>
          <span>x</span>
        </div>

        <p>© 2025 Foodie Technologies Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
