import "./Analytics.css";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function Analytics() {
  const [orders, setOrders] = useState([]);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= LOAD ORDERS ================= */
  useEffect(() => {
    if (!restaurantId || !token) return;

    axios
      .get(
        `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(res => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("ANALYTICS API ERROR:", err));
  }, [restaurantId, token]);

  /* ================= CALCULATIONS ================= */

  let completed = 0;
  let pending = 0;
  let cancelled = 0;

  const dayMap = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  // Menu mix counters
  let veg = 0;
  let nonVeg = 0;
  let dessert = 0;
  let beverage = 0;

  orders.forEach(o => {
    const status = o.orderStatus;

    if (status === "DELIVERED") completed++;
    else if (status === "CANCELLED") cancelled++;
    else pending++;

    if (o.createdAt) {
      const day = new Date(o.createdAt).toLocaleDateString("en-US", {
        weekday: "short",
      });
      if (dayMap[day] !== undefined) {
        dayMap[day]++;
      }
    }

    // Menu Mix logic
    if (Array.isArray(o.items)) {
      o.items.forEach(i => {
        const name = (i.itemName || "").toLowerCase();
        const qty = i.quantity || 1;

        if (
          name.includes("chicken") ||
          name.includes("mutton") ||
          name.includes("egg") ||
          name.includes("fish")
        ) {
          nonVeg += qty;
        } else if (
          name.includes("cake") ||
          name.includes("ice") ||
          name.includes("sweet")
        ) {
          dessert += qty;
        } else if (
          name.includes("coke") ||
          name.includes("pepsi") ||
          name.includes("juice") ||
          name.includes("water")
        ) {
          beverage += qty;
        } else {
          veg += qty;
        }
      });
    }
  });

  const totalOrders = orders.length || 1;
  const avgOrders = Math.round(totalOrders / 7);
  const completionRate = Math.round(
    (completed / totalOrders) * 100
  );

  /* ================= CHART DATA ================= */

  const orderStatusData = {
    labels: ["Orders"],
    datasets: [
      {
        label: "Completed",
        data: [completed],
        backgroundColor: "#020617",
      },
      {
        label: "Pending",
        data: [pending],
        backgroundColor: "#64748b",
      },
      {
        label: "Cancelled",
        data: [cancelled],
        backgroundColor: "#cbd5e1",
      },
    ],
  };

  const foodMixData = {
    labels: ["Menu Items"],
    datasets: [
      {
        label: "Veg",
        data: [veg],
        backgroundColor: "#020617",
      },
      {
        label: "Non-Veg",
        data: [nonVeg],
        backgroundColor: "#475569",
      },
      {
        label: "Dessert",
        data: [dessert],
        backgroundColor: "#94a3b8",
      },
      {
        label: "Beverage",
        data: [beverage],
        backgroundColor: "#cbd5e1",
      },
    ],
  };

  const ordersTrendData = {
    labels: Object.keys(dayMap),
    datasets: [
      {
        data: Object.values(dayMap),
        borderColor: "#020617",
        backgroundColor: "#020617",
        tension: 0.35,
        pointRadius: 3,
      },
    ],
  };

  const stackedBarOptions = {
    responsive: true,
    indexAxis: "y",
    plugins: {
      legend: { position: "bottom" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  };

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <div className="analytics-header">
        <h1>Analytics</h1>
        <p>Operational performance overview</p>
      </div>

      {/* KPI */}
      <div className="analytics-kpis">
        <div className="kpi-card">
          <span className="value">{avgOrders}</span>
          <span className="label">Avg Orders / Day</span>
        </div>
        <div className="kpi-card">
          <span className="value">4.3</span>
          <span className="label">Avg Rating</span>
        </div>
        <div className="kpi-card">
          <span className="value">38%</span>
          <span className="label">Repeat Customers</span>
        </div>
        <div className="kpi-card">
          <span className="value">{completionRate}%</span>
          <span className="label">Completion Rate</span>
        </div>
      </div>

      {/* CHARTS */}
      <div className="analytics-grid">
        <div className="panel small">
          <h2>Order Status Distribution</h2>
          <Bar data={orderStatusData} options={stackedBarOptions} />
        </div>

        <div className="panel small">
          <h2>Menu Mix</h2>
          <Bar data={foodMixData} options={stackedBarOptions} />
        </div>

        <div className="panel wide small">
          <h2>Orders Trend (7 days)</h2>
          <Line data={ordersTrendData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}
