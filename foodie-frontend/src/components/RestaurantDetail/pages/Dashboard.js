import { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import {
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiBarChart2,
  FiSettings,
  FiShield
} from "react-icons/fi";
import axios from "axios";

export default function Dashboard() {

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get("http://localhost:9092/restaurant-api/admin/stats", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      setStats(res.data);
    })
    .catch(err => {
      console.error("Failed to load admin stats", err);
    });
  }, []);

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">
            Monitor restaurants, owners and platform activity
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <StatCard
          title="Total Restaurants"
          value={stats.total}
          icon={<FiUsers />}
        />

        <StatCard
          title="Active Restaurants"
          value={stats.active}
          icon={<FiCheckCircle />}
        />

        <StatCard
          title="Pending KYC"
          value={stats.pending}
          icon={<FiClock />}
          warning
        />
      </div>

      {/* QUICK ACTIONS */}
      <h3 className="section-title">Quick Actions</h3>

      <div className="actions-grid">

        <div className="action-card">
          <FiShield />
          <h4>Approve Owners</h4>
          <p>Review and verify new restaurant owners</p>
        </div>

        <div className="action-card">
          <FiSettings />
          <h4>Manage Restaurants</h4>
          <p>Enable, disable or update restaurant listings</p>
        </div>

        <div className="action-card">
          <FiBarChart2 />
          <h4>View Analytics</h4>
          <p>Track orders, revenue and growth metrics</p>
        </div>

        <div className="action-card">
          <FiUsers />
          <h4>Subscription Plans</h4>
          <p>Manage commissions and restaurant plans</p>
        </div>

      </div>

    </div>
  );
}
