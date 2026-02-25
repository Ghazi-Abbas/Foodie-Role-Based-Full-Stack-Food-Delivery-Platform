// import "./LiveOrders.css";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function LiveOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // 🔑 restaurantId & token
//   const restaurantId = localStorage.getItem("restaurantId");
//   const token = localStorage.getItem("token");

//   /* ================= FETCH ACTIVE ORDERS ================= */

//   const fetchLiveOrders = async () => {
//     if (!restaurantId || !token) {
//       console.warn("Missing restaurantId or token");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}/active`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setOrders(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("Failed to load live orders", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchLiveOrders();

//     // 🔁 OPTIONAL: auto-refresh every 10 sec
//     // const interval = setInterval(fetchLiveOrders, 10000);
//     // return () => clearInterval(interval);
//   }, []);

//   /* ================= UPDATE ORDER STATUS ================= */

//   const updateStatus = async (orderId, newStatus, e) => {
//     e.stopPropagation();

//     try {
//       await axios.put(
//         `http://localhost:9092/restaurant/orders/${orderId}/status`,
//         { status: newStatus },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       // 🔄 Refresh after status update
//       fetchLiveOrders();
//     } catch (err) {
//       console.error("Status update failed", err);
//       alert("Failed to update order status");
//     }
//   };

//   /* ================= UI ================= */

//   if (loading) {
//     return <p className="loading">Loading live orders...</p>;
//   }

//   return (
//     <div className="live-orders-page">

//       {/* HEADER */}
//       <div className="live-orders-header">
//         <h1>Live Orders</h1>
//         <p>Orders that require immediate kitchen action</p>
//       </div>

//       {/* ORDERS LIST */}
//       <div className="orders-list">
//         {orders.length === 0 && (
//           <p className="empty-text">No active orders right now</p>
//         )}

//         {orders.map((order) => (
//           <div
//             key={order.id}
//             className="order-card clickable"
//             onClick={() =>
//               navigate(`/restaurant-dashboard/orders/${order.id}`)
//             }
//           >
//             {/* LEFT */}
//             <div className="order-info">
//               <div className="order-id">#{order.id}</div>

//               <div className="order-items">
//                 {order.items && order.items.length > 0
//                   ? order.items
//                       .map(i => `${i.quantity}× ${i.itemName}`)
//                       .join(", ")
//                   : "No items"}
//               </div>

//               <div className="order-meta">
//                 ₹{order.totalAmount} •{" "}
//                 {order.createdAt
//                   ? new Date(order.createdAt).toLocaleTimeString()
//                   : "--"}
//               </div>
//             </div>

//             {/* STATUS */}
//             <div className="order-status">
//               <span
//                 className={`status-badge ${
//                   order.orderStatus
//                     ? order.orderStatus.toLowerCase()
//                     : ""
//                 }`}
//               >
//                 {order.orderStatus}
//               </span>
//             </div>

//             {/* ACTIONS */}
//             <div className="order-actions">
//               {order.orderStatus === "CREATED" && (
//                 <>
//                   <button
//                     className="btn primary"
//                     onClick={(e) =>
//                       updateStatus(order.id, "PREPARING", e)
//                     }
//                   >
//                     Accept
//                   </button>

//                   <button
//                     className="btn ghost"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     Reject
//                   </button>
//                 </>
//               )}

//               {order.orderStatus === "PREPARING" && (
//                 <button
//                   className="btn success"
//                   onClick={(e) =>
//                     updateStatus(order.id, "READY", e)
//                   }
//                 >
//                   Mark Ready
//                 </button>
//               )}

//               {order.orderStatus === "READY" && (
//                 <span className="handover-text">
//                   Waiting for pickup
//                 </span>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// import "./LiveOrders.css";
// import { useEffect, useState, useCallback, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function LiveOrders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // 🔑 JWT token
//   const token =
//     localStorage.getItem("token") &&
//     localStorage.getItem("token") !== "null"
//       ? localStorage.getItem("token")
//       : null;

//   // 🧠 restaurantId (cached)
//   const [restaurantId, setRestaurantId] = useState(() => {
//     const id = localStorage.getItem("restaurantId");
//     return id && id !== "null" ? id : null;
//   });

//   const intervalRef = useRef(null);

//   /* ================= SAFE JWT DECODE ================= */
//   const decodeJwt = () => {
//     try {
//       if (!token) return null;
//       return JSON.parse(atob(token.split(".")[1]));
//     } catch {
//       return null;
//     }
//   };

//   /* ================= RESOLVE RESTAURANT ID ================= */
//   const resolveRestaurantId = useCallback(async () => {
//     const payload = decodeJwt();
//     if (!payload?.sub || !token) return;

//     try {
//       const res = await axios.get(
//         `http://localhost:9092/restaurant-api/owner/${payload.sub}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       if (Array.isArray(res.data) && res.data.length > 0) {
//         const id = res.data[0].id;
//         localStorage.setItem("restaurantId", id);
//         setRestaurantId(id);
//       }
//     } catch (err) {
//       console.error("❌ Failed to resolve restaurantId", err);
//     }
//   }, [token]);

//   /* ================= FETCH ACTIVE ORDERS ================= */
//   const fetchLiveOrders = useCallback(async () => {
//     if (!restaurantId || !token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}/active`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       setOrders(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error("❌ Failed to load live orders", err);
//       setOrders([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [restaurantId, token]);

//   /* ================= EFFECT: INIT ================= */
//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     if (!restaurantId) {
//       resolveRestaurantId();
//     }
//   }, [token, restaurantId, resolveRestaurantId]);

//   /* ================= EFFECT: FETCH + AUTO REFRESH ================= */
//   useEffect(() => {
//     if (!restaurantId || !token) return;

//     fetchLiveOrders();

//     // 🔁 auto refresh every 10s
//     intervalRef.current = setInterval(fetchLiveOrders, 10000);

//     return () => clearInterval(intervalRef.current);
//   }, [restaurantId, token, fetchLiveOrders]);

//   /* ================= UI ================= */
//   if (loading) {
//     return <p className="loading">Loading live orders...</p>;
//   }

//   return (
//     <div className="live-orders-page">
//       <div className="live-orders-header">
//         <h1>Live Orders</h1>
//         <p>Orders that require immediate kitchen action</p>
//       </div>

//       <div className="orders-list">
//         {orders.length === 0 && (
//           <p className="empty-text">No active orders right now</p>
//         )}

//         {orders.map((order) => {
//           // ✅ IMPORTANT: support CREATED orders
//           const status = order.orderStatus || "CREATED";

//           return (
//             <div
//               key={order.id}
//               className="order-card clickable"
//               onClick={() =>
//                 navigate(`/restaurant-dashboard/orders/${order.id}`)
//               }
//             >
//               {/* LEFT */}
//               <div className="order-info">
//                 <div className="order-id">#{order.id}</div>

//                 <div className="order-items">
//                   {Array.isArray(order.items) && order.items.length > 0
//                     ? order.items
//                         .map(
//                           (i) =>
//                             `${i.quantity || 1}× ${i.itemName || "Item"}`
//                         )
//                         .join(", ")
//                     : "No items"}
//                 </div>

//                 <div className="order-meta">
//                   ₹{order.totalAmount ?? 0} •{" "}
//                   {order.createdAt
//                     ? new Date(order.createdAt).toLocaleTimeString()
//                     : "--"}
//                 </div>
//               </div>

//               {/* STATUS */}
//               <div className="order-status">
//                 <span className={`status-badge ${status.toLowerCase()}`}>
//                   {status}
//                 </span>
//               </div>

//               {/* ACTIONS */}
//               <div className="order-actions">
//                 {/* 🔵 CREATED → ACCEPTED */}
//                 {status === "CREATED" && (
//                   <button
//                     className="btn primary"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateStatus(order.id, "ACCEPTED");
//                     }}
//                   >
//                     Accept Order
//                   </button>
//                 )}

//                 {/* 🟡 PLACED → ACCEPTED (safe fallback) */}
//                 {status === "PLACED" && (
//                   <button
//                     className="btn primary"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateStatus(order.id, "ACCEPTED");
//                     }}
//                   >
//                     Accept Order
//                   </button>
//                 )}

//                 {/* 🔵 ACCEPTED → PREPARING */}
//                 {status === "ACCEPTED" && (
//                   <button
//                     className="btn primary"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateStatus(order.id, "PREPARING");
//                     }}
//                   >
//                     Start Preparing
//                   </button>
//                 )}

//                 {/* 🟢 PREPARING → READY */}
//                 {status === "PREPARING" && (
//                   <button
//                     className="btn success"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       updateStatus(order.id, "READY");
//                     }}
//                   >
//                     Mark Ready
//                   </button>
//                 )}

//                 {/* ✅ READY */}
//                 {status === "READY" && (
//                   <span className="handover-text">
//                     Waiting for pickup
//                   </span>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );

//   /* ================= UPDATE STATUS ================= */
//   async function updateStatus(orderId, newStatus) {
//     if (!token) return;

//     try {
//       await axios.put(
//         `http://localhost:9092/restaurant/orders/${orderId}/status`,
//         { status: newStatus },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       fetchLiveOrders();
//     } catch (err) {
//       console.error("❌ Status update failed", err);
//       alert("Failed to update order status");
//     }
//   }
// }
import "./LiveOrders.css";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LiveOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔑 JWT token
  const token =
    localStorage.getItem("token") &&
    localStorage.getItem("token") !== "null"
      ? localStorage.getItem("token")
      : null;

  // 🧠 restaurantId (cached)
  const [restaurantId, setRestaurantId] = useState(() => {
    const id = localStorage.getItem("restaurantId");
    return id && id !== "null" ? id : null;
  });

  const intervalRef = useRef(null);

  /* ================= SAFE JWT DECODE ================= */
  const decodeJwt = () => {
    try {
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  /* ================= RESOLVE RESTAURANT ID ================= */
  const resolveRestaurantId = useCallback(async () => {
    const payload = decodeJwt();
    if (!payload?.sub || !token) return;

    try {
      const res = await axios.get(
        `http://localhost:9092/restaurant-api/owner/${payload.sub}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data) && res.data.length > 0) {
        const id = res.data[0].id;
        localStorage.setItem("restaurantId", id);
        setRestaurantId(id);
      }
    } catch (err) {
      console.error("❌ Failed to resolve restaurantId", err);
    }
  }, [token]);

  /* ================= FETCH ACTIVE ORDERS ================= */
  const fetchLiveOrders = useCallback(async () => {
    if (!restaurantId || !token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}/active`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Failed to load live orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [restaurantId, token]);

  /* ================= EFFECT: INIT ================= */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    if (!restaurantId) {
      resolveRestaurantId();
    }
  }, [token, restaurantId, resolveRestaurantId]);

  /* ================= EFFECT: FETCH + AUTO REFRESH ================= */
  useEffect(() => {
    if (!restaurantId || !token) return;

    fetchLiveOrders();

    intervalRef.current = setInterval(fetchLiveOrders, 10000);

    return () => clearInterval(intervalRef.current);
  }, [restaurantId, token, fetchLiveOrders]);

  /* ================= UI ================= */
  if (loading) {
    return <p className="loading">Loading live orders...</p>;
  }

  return (
    <div className="live-orders-page">
      <div className="live-orders-header">
        <h1>Live Orders</h1>
        <p>Orders that require immediate kitchen action</p>
      </div>

      <div className="orders-list">
        {orders.length === 0 && (
          <p className="empty-text">No active orders right now</p>
        )}

        {orders.map((order) => {
          const status = order.orderStatus || "PLACED";

          return (
            <div
              key={order.id}
              className="order-card clickable"
              onClick={() =>
                navigate(`/restaurant-dashboard/orders/${order.id}`)
              }
            >
              {/* LEFT */}
              <div className="order-info">
                <div className="order-id">#{order.id}</div>

                <div className="order-items">
                  {Array.isArray(order.items) && order.items.length > 0
                    ? order.items
                        .map(
                          (i) =>
                            `${i.quantity || 1}× ${i.itemName || "Item"}`
                        )
                        .join(", ")
                    : "No items"}
                </div>

                <div className="order-meta">
                  ₹{order.totalAmount ?? 0} •{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString()
                    : "--"}
                </div>
              </div>

              {/* STATUS */}
              <div className="order-status">
                <span className={`status-badge ${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="order-actions">
                {/* PLACED → ACCEPTED */}
                {status === "PLACED" && (
                  <button
                    className="btn primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, "ACCEPTED");
                    }}
                  >
                    Accept Order
                  </button>
                )}

                {/* ACCEPTED → PREPARING */}
                {status === "ACCEPTED" && (
                  <button
                    className="btn primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, "PREPARING");
                    }}
                  >
                    Start Preparing
                  </button>
                )}

                {/* PREPARING → READY */}
                {status === "PREPARING" && (
                  <button
                    className="btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, "READY");
                    }}
                  >
                    Mark Ready
                  </button>
                )}

                {/* READY → DELIVERED (NO DELIVERY PARTNER YET) */}
                {status === "READY" && (
                  <button
                    className="btn success"
                    onClick={(e) => {
                      e.stopPropagation();
                      updateStatus(order.id, "DELIVERED");
                    }}
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ================= UPDATE STATUS ================= */
  async function updateStatus(orderId, newStatus) {
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:9092/restaurant/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchLiveOrders();
    } catch (err) {
      console.error("❌ Status update failed", err);
      alert("Failed to update order status");
    }
  }
}
