// import "./DashboardHome.css";
// import { FiShoppingBag, FiDollarSign, FiClock } from "react-icons/fi";
// import { useEffect, useState } from "react";
// import axios from "axios";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
// } from "chart.js";

// import { Bar } from "react-chartjs-2";

// /* Register Chart.js modules */
// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

// export default function DashboardHome() {
//   const [restaurant, setRestaurant] = useState(null);
//   const [summary, setSummary] = useState({
//     ordersToday: 0,
//     revenueToday: 0,
//     pendingOrders: 0,
//   });
//   const [liveOrders, setLiveOrders] = useState([]);
//   const [chartData, setChartData] = useState(null);
//   const [ownerEmail, setOwnerEmail] = useState("");

//   const token = localStorage.getItem("token");

//   /* ================= LOAD RESTAURANT ================= */
//   useEffect(() => {
//     if (!token) return;

//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const email = payload.sub;
//     const roles = payload.roles || [];

//     setOwnerEmail(email);

//     if (!roles.includes("RESTAURANT_OWNER")) return;

//     axios
//       .get(`http://localhost:9092/restaurant-api/owner/${email}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then(res => {
//         if (Array.isArray(res.data) && res.data.length > 0) {
//           setRestaurant(res.data[0]);
//           localStorage.setItem("restaurantId", res.data[0].id);
//         }
//       })
//       .catch(err => console.error("OWNER API ERROR:", err));
//   }, [token]);

//   /* ================= LOAD DASHBOARD DATA ================= */
//   useEffect(() => {
//     if (!restaurant || !token) return;

//     const headers = { Authorization: `Bearer ${token}` };

//     axios
//       .get(
//         `http://localhost:9092/restaurant/dashboard/orders/${restaurant.id}/active`,
//         { headers }
//       )
//       .then(res => {
//         const orders = Array.isArray(res.data) ? res.data : [];
//         setLiveOrders(orders);

//         /* ================= SUMMARY ================= */
//         const todayStr = new Date().toDateString();
//         let revenue = 0;
//         let pending = 0;

//         orders.forEach(o => {
//           const status = o.orderStatus || "";
//           const orderDate = o.createdAt
//             ? new Date(o.createdAt).toDateString()
//             : "";

//           if (orderDate === todayStr) {
//             revenue += o.totalAmount || 0;
//           }

//           if (["CREATED", "ACCEPTED", "PREPARING"].includes(status)) {
//             pending++;
//           }
//         });

//         setSummary({
//           ordersToday: orders.length,
//           revenueToday: Math.round(revenue),
//           pendingOrders: pending,
//         });

//         /* ================= WEEKLY CHART (REAL DATA) ================= */
//         const dayMap = {
//           Mon: 0,
//           Tue: 0,
//           Wed: 0,
//           Thu: 0,
//           Fri: 0,
//           Sat: 0,
//           Sun: 0,
//         };

//         orders.forEach(o => {
//           if (!o.createdAt) return;

//           const day = new Date(o.createdAt).toLocaleDateString("en-US", {
//             weekday: "short",
//           });

//           if (dayMap[day] !== undefined) {
//             dayMap[day] += 1;
//           }
//         });

//         setChartData({
//           labels: Object.keys(dayMap),
//           datasets: [
//             {
//               label: "Orders",
//               data: Object.values(dayMap),
//               backgroundColor: "#0f172a",
//               borderRadius: 6,
//               barThickness: 26,
//             },
//           ],
//         });
//       })
//       .catch(err => {
//         console.error("ORDER API ERROR:", err);
//         setLiveOrders([]);
//       });
//   }, [restaurant, token]);

//   /* ================= CHART OPTIONS ================= */
//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: { display: false },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         ticks: { precision: 0 },
//       },
//     },
//   };

//   return (
//     <div className="dashboard">
//       {/* HEADER */}
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <p>Operational overview of today’s restaurant performance</p>

//         {restaurant && (
//           <div className="restaurant-meta">
//             <span>
//               <strong>Restaurant:</strong> {restaurant.restaurantName}
//             </span>
//             <span>
//               <strong>Restaurant ID:</strong> {restaurant.id}
//             </span>
//             <span>
//               <strong>Owner:</strong> {ownerEmail}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* KPI */}
//       <div className="metrics-grid">
//         <div className="metric-card large">
//           <FiShoppingBag />
//           <div>
//             <span className="metric-value big">
//               {summary.ordersToday}
//             </span>
//             <span className="metric-label">Orders Today</span>
//           </div>
//         </div>

//         <div className="metric-card large">
//           <FiDollarSign />
//           <div>
//             <span className="metric-value big">
//               ₹{summary.revenueToday}
//             </span>
//             <span className="metric-label">Revenue Today</span>
//           </div>
//         </div>

//         <div className="metric-card large">
//           <FiClock />
//           <div>
//             <span className="metric-value big">
//               {summary.pendingOrders}
//             </span>
//             <span className="metric-label">Pending Orders</span>
//           </div>
//         </div>

//         <div className="metric-card large status-card">
//           <span
//             className={`status-dot ${
//               restaurant?.active ? "open" : "closed"
//             }`}
//           />
//           <div>
//             <span className="metric-value big">
//               {restaurant?.active ? "Open" : "Closed"}
//             </span>
//             <span className="metric-label">
//               Restaurant Status
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="dashboard-content">
//         <div className="left-column">
//           {/* LIVE ORDERS */}
//           <div className="panel">
//             <div className="panel-header">
//               <h2>Live Orders</h2>
//               <span className="subtle-text">Kitchen in progress</span>
//             </div>

//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Items</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {liveOrders.length === 0 ? (
//                   <tr>
//                     <td colSpan="3">No live orders</td>
//                   </tr>
//                 ) : (
//                   liveOrders.map(order => (
//                     <tr key={order.id}>
//                       <td>#{order.id.slice(-6)}</td>
//                       <td>
//                         {order.items
//                           ?.map(i => `${i.quantity}× ${i.itemName}`)
//                           .join(", ")}
//                       </td>
//                       <td>
//                         <span
//                           className={`status-pill ${(
//                             order.orderStatus || "CREATED"
//                           ).toLowerCase()}`}
//                         >
//                           {order.orderStatus}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* CHART */}
//           <div className="panel">
//             <h2>Daily Order Load</h2>
//             <div className="chart-container large">
//               {chartData && (
//                 <Bar data={chartData} options={chartOptions} />
//               )}
//             </div>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="panel">
//           <h2>Quick Actions</h2>
//           <div className="action-list">
//             <button className="action-item">Manage Menu</button>
//             <button className="action-item">View Orders</button>
//             <button className="action-item">
//               Change Restaurant Status
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import "./DashboardHome.css";
import { FiShoppingBag, FiDollarSign, FiClock } from "react-icons/fi";
import { useEffect, useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";

import { Bar } from "react-chartjs-2";

/* Register Chart.js modules */
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function DashboardHome() {
  const [restaurant, setRestaurant] = useState(null);
  const [summary, setSummary] = useState({
    ordersToday: 0,
    revenueToday: 0,
    pendingOrders: 0,
  });
  const [liveOrders, setLiveOrders] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [ownerEmail, setOwnerEmail] = useState("");

  const token = localStorage.getItem("token");

  /* ================= LOAD RESTAURANT ================= */
  useEffect(() => {
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;
    const roles = payload.roles || [];

    setOwnerEmail(email);

    if (!roles.includes("RESTAURANT_OWNER")) return;

    axios
      .get(`http://localhost:9092/restaurant-api/owner/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setRestaurant(res.data[0]);
          localStorage.setItem("restaurantId", res.data[0].id);
        }
      })
      .catch(err => console.error("OWNER API ERROR:", err));
  }, [token]);

  /* ================= LOAD DASHBOARD DATA ================= */
  useEffect(() => {
    if (!restaurant || !token) return;

    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(
        `http://localhost:9092/restaurant/dashboard/orders/${restaurant.id}/active`,
        { headers }
      )
      .then(res => {
        const orders = Array.isArray(res.data) ? res.data : [];
        setLiveOrders(orders);

        /* ================= SUMMARY ================= */
        const todayStr = new Date().toDateString();
        let revenue = 0;
        let pending = 0;

        orders.forEach(o => {
          const status = o.orderStatus || "";
          const orderDate = o.createdAt
            ? new Date(o.createdAt).toDateString()
            : "";

          if (orderDate === todayStr) {
            revenue += o.totalAmount || 0;
          }

          if (["CREATED", "ACCEPTED", "PREPARING"].includes(status)) {
            pending++;
          }
        });

        setSummary({
          ordersToday: orders.length,
          revenueToday: Math.round(revenue),
          pendingOrders: pending,
        });

        /* ================= WEEKLY CHART (REAL DATA) ================= */
        const dayMap = {
          Mon: 0,
          Tue: 0,
          Wed: 0,
          Thu: 0,
          Fri: 0,
          Sat: 0,
          Sun: 0,
        };

        orders.forEach(o => {
          if (!o.createdAt) return;

          const day = new Date(o.createdAt).toLocaleDateString("en-US", {
            weekday: "short",
          });

          if (dayMap[day] !== undefined) {
            dayMap[day] += 1;
          }
        });

        setChartData({
          labels: Object.keys(dayMap),
          datasets: [
            {
              label: "Orders",
              data: Object.values(dayMap),
              backgroundColor: "#0f172a",
              borderRadius: 6,
              barThickness: 26,
            },
          ],
        });
      })
      .catch(err => {
        console.error("ORDER API ERROR:", err);
        setLiveOrders([]);
      });
  }, [restaurant, token]);

  /* ================= CHART OPTIONS ================= */
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Operational overview of today’s restaurant performance</p>

        {restaurant && (
          <div className="restaurant-meta">
            <span>
              <strong>Restaurant:</strong> {restaurant.restaurantName}
            </span>
            <span>
              <strong>Restaurant ID:</strong> {restaurant.id}
            </span>
            <span>
              <strong>Owner:</strong> {ownerEmail}
            </span>
          </div>
        )}
      </div>

      {/* KPI */}
      <div className="metrics-grid">
        <div className="metric-card large">
          <FiShoppingBag />
          <div>
            <span className="metric-value big">
              {summary.ordersToday}
            </span>
            <span className="metric-label">Orders Today</span>
          </div>
        </div>

        <div className="metric-card large">
          <FiDollarSign />
          <div>
            <span className="metric-value big">
              ₹{summary.revenueToday}
            </span>
            <span className="metric-label">Revenue Today</span>
          </div>
        </div>

        <div className="metric-card large">
          <FiClock />
          <div>
            <span className="metric-value big">
              {summary.pendingOrders}
            </span>
            <span className="metric-label">Pending Orders</span>
          </div>
        </div>

        <div className="metric-card large status-card">
          <span
            className={`status-dot ${
              restaurant?.active ? "open" : "closed"
            }`}
          />
          <div>
            <span className="metric-value big">
              {restaurant?.active ? "Open" : "Closed"}
            </span>
            <span className="metric-label">
              Restaurant Status
            </span>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="dashboard-content">
        <div className="left-column">
          {/* LIVE ORDERS */}
          <div className="panel">
            <div className="panel-header">
              <h2>Live Orders</h2>
              <span className="subtle-text">Kitchen in progress</span>
            </div>

            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Items</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {liveOrders.length === 0 ? (
                  <tr>
                    <td colSpan="3">No live orders</td>
                  </tr>
                ) : (
                  liveOrders.map(order => (
                    <tr key={order.id}>
                      <td>#{order.id.slice(-6)}</td>
                      <td>
                        {order.items
                          ?.map(i => `${i.quantity}× ${i.itemName}`)
                          .join(", ")}
                      </td>
                      <td>
                        <span
                          className={`status-pill ${(
                            order.orderStatus || "CREATED"
                          ).toLowerCase()}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* CHART */}
          <div className="panel">
            <h2>Daily Order Load</h2>
            <div className="chart-container large">
              {chartData && (
                <Bar data={chartData} options={chartOptions} />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="panel">
          <h2>Quick Actions</h2>
          <div className="action-list">
            <button className="action-item">Manage Menu</button>
            <button className="action-item">View Orders</button>
            <button className="action-item">
              Change Restaurant Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
