import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "./OrderCard";

const Orders = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);

      try {
        const [activeRes, historyRes] = await Promise.all([
          fetch("http://localhost:9092/user/orders/active", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:9092/user/orders/history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const activeData = await activeRes.json();
        const historyData = await historyRes.json();

        setActiveOrders(Array.isArray(activeData) ? activeData : []);
        setPastOrders(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error("Order fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* ---------------- NAVIGATION ---------------- */

  const handlePastOrderClick = (order) => {
    if (order.orderStatus !== "DELIVERED") return;

    const items =
      order.items ||
      order.order?.items ||
      order._doc?.items ||
      [];

    if (!items.length) return;

    const firstItem = items[0];

    navigate(
      `/restaurant/${order.restaurantId}/item/${firstItem.foodItemId}`
    );
  };

  /* ---------------- STATES ---------------- */

  if (loading) {
    return (
      <div style={styles.centerBox}>
        <p style={styles.hint}>Loading your orders…</p>
      </div>
    );
  }

  if (activeOrders.length === 0 && pastOrders.length === 0) {
    return (
      <div style={styles.centerBox}>
        <p style={styles.hint}>Your orders will appear here</p>
        <h2 style={styles.emptyTitle}>No Orders Yet</h2>
        <p style={styles.subHint}>
          Start exploring restaurants and place your first order 🍽️
        </p>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.page}>
      {/* ================= ACTIVE ORDERS ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🟡 Active Orders</h3>

        {activeOrders.length > 0 ? (
          <div style={styles.list}>
            {activeOrders.map(order => (
              <OrderCard
                key={order.id || order.orderId}
                order={order}
                active
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>No active orders right now</p>
          </div>
        )}
      </section>

      {/* ================= PAST ORDERS ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>🟢 Past Orders</h3>

        {pastOrders.length > 0 ? (
          <div style={styles.list}>
            {pastOrders.map(order => (
              <div
                key={order.id || order.orderId}
                style={{
                  cursor:
                    order.orderStatus === "DELIVERED"
                      ? "pointer"
                      : "default",
                }}
                onClick={() => handlePastOrderClick(order)}
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyBox}>
            <p style={styles.emptyText}>
              You haven’t completed any orders yet
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Orders;

/* ===================== STYLES ===================== */

const styles = {
  page: {
    width: "100%",
    height: "calc(87vh - 120px)",
    padding: "32px 40px",
    background: "#fafafa",
    overflowY: "auto",
  },

  section: {
    marginBottom: "36px",
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "16px",
    color: "#1c1c1c",
    borderBottom: "2px solid #e23744",
    display: "inline-block",
    paddingBottom: "6px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  emptyBox: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  emptyText: {
    fontSize: "14px",
    color: "#686b78",
  },

  centerBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    background: "#fafafa",
    padding: "40px",
  },

  hint: {
    fontSize: "14px",
    color: "#686b78",
    marginBottom: "6px",
  },

  emptyTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1c1c1c",
    marginBottom: "4px",
  },

  subHint: {
    fontSize: "14px",
    color: "#93959f",
  },
};
// import { useEffect, useState } from "react";
// import OrderCard from "./OrderCard";

// const Orders = () => {
//   const [activeOrders, setActiveOrders] = useState([]);
//   const [pastOrders, setPastOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return setLoading(false);

//       try {
//         const [activeRes, historyRes] = await Promise.all([
//           fetch("http://localhost:9092/user/orders/active", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:9092/user/orders/history", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const activeData = await activeRes.json();
//         const historyData = await historyRes.json();

//         setActiveOrders(Array.isArray(activeData) ? activeData : []);
//         setPastOrders(Array.isArray(historyData) ? historyData : []);

//       } catch (err) {
//         console.error("Order fetch failed", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ---------------- STATES ---------------- */

//   if (loading) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Loading your orders…</p>
//       </div>
//     );
//   }

//   if (activeOrders.length === 0 && pastOrders.length === 0) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Your orders will appear here</p>
//         <h2 style={styles.emptyTitle}>No Orders Yet</h2>
//         <p style={styles.subHint}>
//           Start exploring restaurants and place your first order 🍽️
//         </p>
//       </div>
//     );
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <div style={styles.page}>

//       {/* ================= ACTIVE ORDERS ================= */}
//       <section style={styles.section}>
//         <h3 style={styles.sectionTitle}>🟡 Active Orders</h3>

//         {activeOrders.length > 0 ? (
//           <div style={styles.list}>
//             {activeOrders.map(order => (
//               <OrderCard
//                 key={order.id || order.orderId}   // ✅ FIX
//                 order={order}
//                 active
//               />
//             ))}
//           </div>
//         ) : (
//           <div style={styles.emptyBox}>
//             <p style={styles.emptyText}>
//               No active orders right now
//             </p>
//           </div>
//         )}
//       </section>

//       {/* ================= PAST ORDERS ================= */}
//       <section style={styles.section}>
//         <h3 style={styles.sectionTitle}>🟢 Past Orders</h3>

//         {pastOrders.length > 0 ? (
//           <div style={styles.list}>
//             {pastOrders.map(order => (
//               <OrderCard
//                 key={order.id || order.orderId}   // ✅ FIX
//                 order={order}
//               />
//             ))}
//           </div>
//         ) : (
//           <div style={styles.emptyBox}>
//             <p style={styles.emptyText}>
//               You haven’t completed any orders yet
//             </p>
//           </div>
//         )}
//       </section>

//     </div>
//   );
// };

// export default Orders;

// /* ===================== STYLES ===================== */

// const styles = {
//   page: {
//     width: "100%",
//     height: "calc(87vh - 120px)",
//     padding: "32px 40px",
//     background: "#fafafa",
//     overflowY: "auto",
//   },

//   section: {
//     marginBottom: "36px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: 700,
//     marginBottom: "16px",
//     color: "#1c1c1c",
//     borderBottom: "2px solid #e23744",
//     display: "inline-block",
//     paddingBottom: "6px",
//   },

//   list: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//   },

//   emptyBox: {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "12px",
//     textAlign: "center",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//   },

//   emptyText: {
//     fontSize: "14px",
//     color: "#686b78",
//   },

//   centerBox: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     background: "#fafafa",
//     padding: "40px",
//   },

//   hint: {
//     fontSize: "14px",
//     color: "#686b78",
//     marginBottom: "6px",
//   },

//   emptyTitle: {
//     fontSize: "22px",
//     fontWeight: 700,
//     color: "#1c1c1c",
//     marginBottom: "4px",
//   },

//   subHint: {
//     fontSize: "14px",
//     color: "#93959f",
//   },
// };


// import { useEffect, useState } from "react";
// import OrderCard from "./OrderCard";

// const Orders = () => {
//   const [activeOrders, setActiveOrders] = useState([]);
//   const [pastOrders, setPastOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return setLoading(false);

//       try {
//         const [activeRes, historyRes] = await Promise.all([
//           fetch("http://localhost:9092/user/orders/active", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:9092/user/orders/history", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         const activeData = await activeRes.json();
//         const historyData = await historyRes.json();

//         setActiveOrders(Array.isArray(activeData) ? activeData : []);
//         setPastOrders(Array.isArray(historyData) ? historyData : []);

//       } catch (err) {
//         console.error("Order fetch failed", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ---------------- STATES ---------------- */

//   if (loading) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Loading your orders…</p>
//       </div>
//     );
//   }

//   if (activeOrders.length === 0 && pastOrders.length === 0) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Your orders will appear here</p>
//         <h2 style={styles.emptyTitle}>No Orders Yet</h2>
//         <p style={styles.subHint}>
//           Start exploring restaurants and place your first order 🍽️
//         </p>
//       </div>
//     );
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <div style={styles.page}>

//       {/* ================= ACTIVE ORDERS ================= */}
//       <section style={styles.section}>
//         <h3 style={styles.sectionTitle}>🟡 Active Orders</h3>

//         {activeOrders.length > 0 ? (
//           <div style={styles.list}>
//             {activeOrders.map(order => (
//               <OrderCard key={order.id} order={order} active />
//             ))}
//           </div>
//         ) : (
//           <div style={styles.emptyBox}>
//             <p style={styles.emptyText}>
//               No active orders right now
//             </p>
//           </div>
//         )}
//       </section>

//       {/* ================= PAST ORDERS ================= */}
//       <section style={styles.section}>
//         <h3 style={styles.sectionTitle}>🟢 Past Orders</h3>

//         {pastOrders.length > 0 ? (
//           <div style={styles.list}>
//             {pastOrders.map(order => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         ) : (
//           <div style={styles.emptyBox}>
//             <p style={styles.emptyText}>
//               You haven’t completed any orders yet
//             </p>
//           </div>
//         )}
//       </section>

//     </div>
//   );
// };

// export default Orders;

// /* ===================== STYLES ===================== */

// const styles = {
//   page: {
//     width: "100%",
//     height: "calc(75vh - 120px)",
//     padding: "32px 40px",
//     background: "#fafafa",
//     overflowY: "auto",
//   },

//   section: {
//     marginBottom: "36px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: 700,
//     marginBottom: "16px",
//     color: "#1c1c1c",
//     borderBottom: "2px solid #e23744",
//     display: "inline-block",
//     paddingBottom: "6px",
//   },

//   list: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//   },

//   emptyBox: {
//     background: "#fff",
//     padding: "20px",
//     borderRadius: "12px",
//     textAlign: "center",
//     boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
//   },

//   emptyText: {
//     fontSize: "14px",
//     color: "#686b78",
//   },

//   centerBox: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     background: "#fafafa",
//     padding: "40px",
//   },

//   hint: {
//     fontSize: "14px",
//     color: "#686b78",
//     marginBottom: "6px",
//   },

//   emptyTitle: {
//     fontSize: "22px",
//     fontWeight: 700,
//     color: "#1c1c1c",
//     marginBottom: "4px",
//   },

//   subHint: {
//     fontSize: "14px",
//     color: "#93959f",
//   },
// };

// import { useEffect, useState } from "react";
// import OrderCard from "./OrderCard";

// const Orders = () => {
//   const [activeOrders, setActiveOrders] = useState([]);
//   const [pastOrders, setPastOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) return setLoading(false);

//       try {
//         const [activeRes, historyRes] = await Promise.all([
//           fetch("http://localhost:9092/user/orders/active", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch("http://localhost:9092/user/orders/history", {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         setActiveOrders(await activeRes.json());
//         setPastOrders(await historyRes.json());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, []);

//   /* ---------------- STATES ---------------- */

//   if (loading) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Loading your orders...</p>
//       </div>
//     );
//   }

//   if (activeOrders.length === 0 && pastOrders.length === 0) {
//     return (
//       <div style={styles.centerBox}>
//         <p style={styles.hint}>Your orders will appear here</p>
//         <h2 style={styles.emptyTitle}>No Orders Yet</h2>
//         <p style={styles.subHint}>Looks like you haven’t ordered anything 🍽️</p>
//       </div>
//     );
//   }

//   /* ---------------- UI ---------------- */

//   return (
//     <div style={styles.page}>

//       {/* ACTIVE ORDERS */}
//       {activeOrders.length > 0 && (
//         <section style={styles.section}>
//           <h3 style={styles.sectionTitle}>🟡 Active Orders</h3>
//           <div style={styles.list}>
//             {activeOrders.map(order => (
//               <OrderCard key={order.id} order={order} active />
//             ))}
//           </div>
//         </section>
//       )}

//       {/* PAST ORDERS */}
//       {pastOrders.length > 0 && (
//         <section style={styles.section}>
//           <h3 style={styles.sectionTitle}>🟢 Past Orders</h3>
//           <div style={styles.list}>
//             {pastOrders.map(order => (
//               <OrderCard key={order.id} order={order} />
//             ))}
//           </div>
//         </section>
//       )}

//     </div>
//   );
// };

// export default Orders;

// /* ===================== STYLES ===================== */

// const styles = {
// page: {
//   width: "100%",
//   height: "calc(75vh - 120px)", // 🔥 IMPORTANT
//   padding: "32px 40px",
//   background: "#fafafa",
//   overflowY: "auto",
// },
//   section: {
//     marginBottom: "32px",
//   },

//   sectionTitle: {
//     fontSize: "20px",
//     fontWeight: 700,
//     marginBottom: "16px",
//     color: "#1c1c1c",
//     borderBottom: "2px solid #e23744",
//     display: "inline-block",
//     paddingBottom: "6px",
    
//   },

//   list: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "16px",
//   },

//   centerBox: {
   
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     background: "#fafafa",
//     padding: "16px",
//   },

//   hint: {
//     fontSize: "14px",
//     color: "#686b78",
//     marginBottom: "6px",
//   },

//   emptyTitle: {
//     fontSize: "22px",
//     fontWeight: 700,
//     color: "#1c1c1c",
//     marginBottom: "4px",
//   },

//   subHint: {
//     fontSize: "14px",
//     color: "#93959f",
//   },
// };
