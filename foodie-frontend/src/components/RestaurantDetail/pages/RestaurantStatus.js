import "./RestaurantStatus.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantStatus() {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= LOAD CURRENT STATUS ================= */
  useEffect(() => {
    if (!restaurantId || !token) return;

    axios
      .get(
        `http://localhost:9092/restaurant-api/restaurant/status/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setActive(Boolean(res.data.active));
      })
      .catch(err => {
        console.error("STATUS LOAD ERROR:", err);
      });
  }, [restaurantId, token]);

  /* ================= SAVE STATUS (OWNER APIs) ================= */
  const handleSave = () => {
    if (!restaurantId || !token) return;

    setLoading(true);

    const url = active
      ? `http://localhost:9092/restaurant-api/owner/restaurant/live/${restaurantId}`
      : `http://localhost:9092/restaurant-api/owner/restaurant/offline/${restaurantId}`;

    axios
      .put(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert(
          active
            ? "Restaurant is now LIVE"
            : "Restaurant is now OFFLINE"
        );
      })
      .catch(err => {
        console.error("STATUS UPDATE ERROR:", err);
        alert(
          err.response?.data ||
          "You are not allowed to perform this action"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="status-page">
      {/* HEADER */}
      <div className="status-header">
        <h1>Restaurant Availability</h1>
        <p>Turn your restaurant online or offline</p>
      </div>

      {/* CURRENT STATE */}
      <div className="current-state">
        <span className={`status-dot ${active ? "open" : "closed"}`} />
        <div>
          <h2>{active ? "Open" : "Closed"}</h2>
          <p className="state-description">
            {active
              ? "Restaurant is live and accepting orders."
              : "Restaurant is currently offline."}
          </p>
        </div>
      </div>

      {/* CONFIGURATION */}
      <div className="status-config">
        <div className="config-group">
          <label>Restaurant Status</label>
          <select
            value={active ? "ACTIVE" : "INACTIVE"}
            onChange={e => setActive(e.target.value === "ACTIVE")}
            disabled={loading}
          >
            <option value="ACTIVE">Active (Live)</option>
            <option value="INACTIVE">Inactive (Offline)</option>
          </select>
        </div>
      </div>

      {/* ACTION BAR */}
      <div className="status-actions">
        <div className="action-note">
          Changes may take a few minutes to reflect on customer apps.
        </div>
        <button
          className="primary-btn"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
