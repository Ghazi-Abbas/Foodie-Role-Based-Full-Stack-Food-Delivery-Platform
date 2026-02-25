import "./Settings.css";
import { useState } from "react";

export default function Settings() {
  const [isOpen, setIsOpen] = useState(true);
  const [acceptingOrders, setAcceptingOrders] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  return (
    <div className="settings-page">
      {/* HEADER */}
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage restaurant preferences and controls</p>
      </div>

      {/* SECTION: RESTAURANT INFO */}
      <div className="settings-section">
        <h2>Restaurant Information</h2>

        <div className="field">
          <label>Restaurant Name</label>
          <input value="Foodie Kitchen" disabled />
        </div>

        <div className="field">
          <label>Location</label>
          <input value="Lucknow, Uttar Pradesh" disabled />
        </div>

        <div className="field">
          <label>Contact Number</label>
          <input value="+91 98765 43210" />
        </div>
      </div>

      {/* SECTION: AVAILABILITY */}
      <div className="settings-section">
        <h2>Order Availability</h2>

        <div className="toggle-row">
          <div>
            <strong>Restaurant Open</strong>
            <p>Controls whether customers can place orders</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isOpen}
              onChange={() => setIsOpen(!isOpen)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Accept New Orders</strong>
            <p>Pause orders temporarily during rush</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={acceptingOrders}
              onChange={() => setAcceptingOrders(!acceptingOrders)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      {/* SECTION: NOTIFICATIONS */}
      <div className="settings-section">
        <h2>Notifications</h2>

        <div className="toggle-row">
          <div>
            <strong>Email Notifications</strong>
            <p>Order updates and settlement alerts</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
            <span className="slider" />
          </label>
        </div>

        <div className="toggle-row">
          <div>
            <strong>SMS Notifications</strong>
            <p>Critical alerts only</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={() => setSmsNotif(!smsNotif)}
            />
            <span className="slider" />
          </label>
        </div>
      </div>

      {/* SECTION: PAYOUT */}
      <div className="settings-section">
        <h2>Payout Information</h2>

        <div className="readonly-box">
          <div>
            <strong>Bank Account</strong>
            <p>HDFC Bank •••• 4821</p>
          </div>
          <button className="link-btn">Update</button>
        </div>

        <div className="readonly-box">
          <div>
            <strong>Settlement Cycle</strong>
            <p>Weekly (Every Monday)</p>
          </div>
        </div>
      </div>

      {/* DANGER ZONE */}
      <div className="settings-section danger">
        <h2>Danger Zone</h2>

        <button className="danger-btn">
          Temporarily Suspend Restaurant
        </button>

        <button className="logout-btn">
          Logout from All Devices
        </button>
      </div>
    </div>
  );
}
