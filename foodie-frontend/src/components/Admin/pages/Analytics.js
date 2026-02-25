import "../admin.css";
import { useEffect, useState } from "react";
import {
  getAdminStats,
  getRecentActivity,
  getCityStats,
  getPendingKyc,
  getAllRestaurants
} from "../services/AdminService";
import {
  FiTrendingUp,
  FiCheckCircle,
  FiClock,
  FiActivity
} from "react-icons/fi";

/* ===== CHART.JS SETUP ===== */
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0 });
  const [activity, setActivity] = useState([]);
  const [cities, setCities] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    getAdminStats().then(res => setStats(res.data));
    getRecentActivity().then(res => setActivity(res.data));
    getCityStats().then(res => setCities(res.data));
    getPendingKyc().then(res => setPendingList(res.data));
    getAllRestaurants().then(res => setRestaurants(res.data));


  }, []);

  const restaurantMap = restaurants.reduce((map, r) => {
  map[r.id] = r.restaurantName;
  return map;
}, {});

  const suspended = restaurants.filter(r => r.status === "SUSPENDED").length;
  const rejected = restaurants.filter(r => r.status === "REJECTED").length;
  const blocked = suspended + rejected;

  return (
    <div className="admin-dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <h1>Analytics</h1>
          <p className="subtitle">
            Platform performance & compliance overview
          </p>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="stats-grid">
        <div className="stat-card">
          <FiTrendingUp />
          <h2>{stats.total}</h2>
          <p>Total Restaurants</p>
        </div>

        <div className="stat-card">
          <FiCheckCircle />
          <h2>{stats.active}</h2>
          <p>Live Now</p>
        </div>

        <div className="stat-card">
          <FiClock />
          <h2>{stats.pending}</h2>
          <p>KYC Pending</p>
        </div>

        <div className="stat-card">
          <FiActivity />
          <h2>{blocked}</h2>
          <p>Blocked / Rejected</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">

        {/* City Coverage */}
        <div className="chart-card">
          <h3>City Coverage</h3>
          <Bar
            data={{
              labels: cities.map(c => c.city),
              datasets: [
                {
                  label: "Restaurants",
                  data: cities.map(c => c.total),
                  backgroundColor: "#111"
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              }
            }}
          />
        </div>

        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Restaurant Status</h3>
          <Pie
            data={{
              labels: ["Live", "Pending", "Blocked"],
              datasets: [
                {
                  data: [stats.active, stats.pending, blocked],
                  backgroundColor: ["#111", "#aaa", "#666"]
                }
              ]
            }}
          />
        </div>

      </div>

      {/* KYC QUEUE */}
      <h3 className="section-title">KYC Queue</h3>
      <p>{pendingList.length} restaurants waiting for approval</p>

      {/* RECENT ACTIVITY */}
      <div className="activity-box">
  {activity.length === 0 ? (
    <div className="empty-activity">
      No recent operational actions
    </div>
  ) : (
    activity.map((a, i) => (
      <div key={i} className="activity-item">
        <div className="activity-left">
          <span className={`dot ${a.action.toLowerCase()}`} />
          <div>
            <p className="activity-text">
              <b>{restaurantMap[a.restaurantId] || "Unknown Restaurant"}</b> was{" "}
              {a.action.toLowerCase()}
            </p>
            <span className="activity-time">
              {new Date(a.timestamp).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    ))
  )}
</div>


    </div>
  );
}
