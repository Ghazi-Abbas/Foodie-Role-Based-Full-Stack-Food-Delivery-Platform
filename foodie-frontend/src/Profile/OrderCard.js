export default function OrderCard({ order, active }) {
  return (
    <div
      style={{
        ...styles.card,
        borderLeft: active ? "5px solid #e23744" : "5px solid #e5e7eb",
      }}
    >
      {/* LEFT SECTION */}
      <div style={styles.left}>
        <h4 style={styles.restaurant}>{order.restaurantName}</h4>

        {/* ITEMS */}
        <div style={styles.items}>
          {order.items?.map((item, index) => (
            <div key={index} style={styles.itemRow}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  style={styles.itemImage}
                />
              )}

              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.itemName}</span>
                <span style={styles.itemQty}>Qty: {item.quantity}</span>
              </div>
            </div>
          ))}
        </div>

        {/* META */}
        {/* <div style={styles.meta}>
          <span style={styles.label}>Order ID</span>
          <span style={styles.value}>{order._id}</span>
        </div> */}
        <div style={styles.meta}>
  <span style={styles.label}>Order ID</span>
  <span style={styles.value}>
    {typeof order.id === "string"
      ? order.id
      : order._id?.$oid}
  </span>
</div>

        <div style={styles.meta}>
          <span style={styles.label}>Ordered On</span>
          <span style={styles.value}>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div style={styles.right}>
        <span
          style={{
            ...styles.status,
            backgroundColor: statusColor(order.orderStatus),
          }}
        >
          {order.orderStatus}
        </span>

        <div style={styles.amount}>₹{order.totalAmount}</div>

        {active && <button style={styles.trackBtn}>Track Order</button>}
      </div>
    </div>
  );
}

/* ===================== STYLES ===================== */

const styles = {
  card: {
    width: "100%",
    background: "#ffffff",
    padding: "18px 22px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    
  },

  left: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },

  restaurant: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#1c1c1c",
  },

  items: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "4px",
  },

  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  itemImage: {
    width: "46px",
    height: "46px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #eee",
  },

  itemInfo: {
    display: "flex",
    flexDirection: "column",
  },

  itemName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1c1c1c",
  },

  itemQty: {
    fontSize: "12px",
    color: "#686b78",
  },

  meta: {
    fontSize: "13px",
    display: "flex",
    gap: "6px",
  },

  label: {
    color: "#686b78",
  },

  value: {
    color: "#1c1c1c",
    fontWeight: 500,
  },

  right: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "12px",
    minWidth: "140px",
  },

  status: {
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#fff",
    borderRadius: "999px",
    textTransform: "capitalize",
  },

  amount: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1c1c1c",
  },

  trackBtn: {
    background: "#e23744",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "10px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

/* ===================== STATUS COLORS ===================== */

function statusColor(status) {
  switch (status) {
    case "CREATED":
    case "ACCEPTED":
      return "#f4a261";
    case "PREPARING":
      return "#e9c46a";
    case "ON_THE_WAY":
      return "#2a9d8f";
    case "DELIVERED":
      return "#2ecc71";
    case "CANCELLED":
      return "#9ca3af";
    default:
      return "#6b7280";
  }
}
// export default function OrderCard({ order, active }) {
//   // ✅ Normalize items (supports multiple backend shapes safely)
// const items =
//   order.items ||
//   order.order?.items ||
//   order._doc?.items ||
//   order.data?.items ||
//   order.orderItems ||
//   order.foodItems ||
//   [];


//   return (
//     <div
//       style={{
//         ...styles.card,
//         borderLeft: active ? "5px solid #e23744" : "5px solid #e5e7eb",
//       }}
//     >
//       {/* ================= LEFT SECTION ================= */}
//       <div style={styles.left}>
//         <h4 style={styles.restaurant}>
//           {order.restaurantName || "Restaurant"}
//         </h4>

//         {/* ================= ITEMS ================= */}
//         <div style={styles.items}>
//           {items.length === 0 && (
//             <span style={{ fontSize: "13px", color: "#999" }}>
//               No items found
//             </span>
//           )}

//           {items.map((item, index) => {
//             // ✅ Defensive field mapping (NO BREAKING CHANGES)
//             const name =
//               item.itemName ||
//               item.name ||
//               item.foodItemName ||
//               "Item";

//             const qty =
//               item.quantity ||
//               item.qty ||
//               item.count ||
//               1;

//             return (
//               <div key={index} style={styles.itemRow}>
//                 {item.imageUrl && (
//                   <img
//                     src={item.imageUrl}
//                     alt={name}
//                     style={styles.itemImage}
//                   />
//                 )}

//                 <div style={styles.itemInfo}>
//                   <span style={styles.itemName}>{name}</span>
//                   <span style={styles.itemQty}>Qty: {qty}</span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ================= META ================= */}
//         <div style={styles.meta}>
//           <span style={styles.label}>Order ID</span>
//           <span style={styles.value}>
//             {typeof order.id === "string"
//               ? order.id
//               : order._id?.$oid || "—"}
//           </span>
//         </div>

//         <div style={styles.meta}>
//           <span style={styles.label}>Ordered On</span>
//           <span style={styles.value}>
//             {order.createdAt
//               ? new Date(order.createdAt).toLocaleDateString()
//               : "—"}
//           </span>
//         </div>
//       </div>

//       {/* ================= RIGHT SECTION ================= */}
//       <div style={styles.right}>
//         <span
//           style={{
//             ...styles.status,
//             backgroundColor: statusColor(order.orderStatus),
//           }}
//         >
//           {order.orderStatus || "UNKNOWN"}
//         </span>

//         <div style={styles.amount}>
//           ₹{order.totalAmount ?? 0}
//         </div>

//         {active && (
//           <button style={styles.trackBtn}>
//             Track Order
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

// /* ===================== STYLES ===================== */

// const styles = {
//   card: {
//     width: "100%",
//     background: "#ffffff",
//     padding: "18px 22px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     gap: "20px",
//     borderRadius: "12px",
//     boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
//   },

//   left: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     flex: 1,
//   },

//   restaurant: {
//     margin: 0,
//     fontSize: "18px",
//     fontWeight: 700,
//     color: "#1c1c1c",
//   },

//   items: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "10px",
//     marginTop: "4px",
//   },

//   itemRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: "10px",
//   },

//   itemImage: {
//     width: "46px",
//     height: "46px",
//     borderRadius: "8px",
//     objectFit: "cover",
//     border: "1px solid #eee",
//   },

//   itemInfo: {
//     display: "flex",
//     flexDirection: "column",
//   },

//   itemName: {
//     fontSize: "14px",
//     fontWeight: 600,
//     color: "#1c1c1c",
//   },

//   itemQty: {
//     fontSize: "12px",
//     color: "#686b78",
//   },

//   meta: {
//     fontSize: "13px",
//     display: "flex",
//     gap: "6px",
//   },

//   label: {
//     color: "#686b78",
//   },

//   value: {
//     color: "#1c1c1c",
//     fontWeight: 500,
//   },

//   right: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "flex-end",
//     gap: "12px",
//     minWidth: "140px",
//   },

//   status: {
//     padding: "4px 12px",
//     fontSize: "12px",
//     fontWeight: 600,
//     color: "#fff",
//     borderRadius: "999px",
//     textTransform: "capitalize",
//   },

//   amount: {
//     fontSize: "18px",
//     fontWeight: 700,
//     color: "#1c1c1c",
//   },

//   trackBtn: {
//     background: "#e23744",
//     color: "#fff",
//     border: "none",
//     padding: "8px 18px",
//     borderRadius: "10px",
//     fontSize: "13px",
//     fontWeight: 600,
//     cursor: "pointer",
//   },
// };

// /* ===================== STATUS COLORS ===================== */

// function statusColor(status) {
//   switch (status) {
//     case "CREATED":
//     case "ACCEPTED":
//       return "#f4a261";
//     case "PREPARING":
//       return "#e9c46a";
//     case "ON_THE_WAY":
//       return "#2a9d8f";
//     case "DELIVERED":
//       return "#2ecc71";
//     case "CANCELLED":
//       return "#9ca3af";
//     default:
//       return "#6b7280";
//   }
// }
