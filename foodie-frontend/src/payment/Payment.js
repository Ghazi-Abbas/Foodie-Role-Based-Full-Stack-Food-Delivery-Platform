import { PayPalButtons } from "@paypal/react-paypal-js";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ AMOUNT FROM CHECKOUT
  const amountInINR = location.state?.amountInINR || 0;
  const amountInUSD = (amountInINR / 83).toFixed(2);

  if (!amountInINR) {
    return <p style={{ textAlign: "center" }}>Invalid payment request</p>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>

        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>Complete Your Payment</h2>
          <p style={styles.subtitle}>
            Secure checkout powered by PayPal Sandbox
          </p>
        </div>

        {/* SUMMARY */}
        <div style={styles.summaryBox}>
          <div style={styles.row}>
            <span style={styles.label}>Order Reference</span>
            <span style={styles.value}>AUTO-GENERATED</span>
          </div>

          <div style={styles.row}>
            <span style={styles.label}>Amount Payable</span>
            <span style={styles.amount}>${amountInUSD}</span>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.row}>
            <span style={styles.smallText}>Payment Method</span>
            <span style={styles.method}>PayPal / Card</span>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#686b78", marginBottom: 8 }}>
          Almost there! Complete payment to place your order 🍔
        </p>

        {/* PAYPAL */}
        <div style={styles.paypalContainer}>
          <PayPalButtons
            style={{ layout: "vertical", shape: "rect", label: "pay" }}

            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: { value: amountInUSD }
                  }
                ]
              });
            }}

            onApprove={(data, actions) => {
              return actions.order.capture().then(async () => {

                const token = localStorage.getItem("token");
                if (!token) {
                  toast.error("Session expired. Please login again.");
                  setTimeout(() => navigate("/login"), 1500);
                  return;
                }

                const response = await fetch(
                  "http://localhost:9092/orders/place",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      paypalOrderId: data.orderID
                    })
                  }
                );

                if (!response.ok) {
                  toast.error("Order placement failed ❌");
                  return;
                }

                const orders = await response.json();

                // ✅ SUCCESS TOAST
                toast.success(`🎉 ${orders.length} order(s) placed successfully`);

                orders.forEach(o => {
                  toast.info(`${o.restaurantName} • ₹${o.totalAmount}`, {
                    autoClose: 2000
                  });
                });
window.dispatchEvent(new Event("cart-change"));
                // ⏳ DELAY NAVIGATION (IMPORTANT)
                setTimeout(() => {
                  navigate("/profile?tab=orders");
                }, 1700);
              });
            }}
          />
        </div>

        {/* FOOTER */}
        <div style={styles.footerNote}>
          <span style={styles.lock}>🔒</span>
          <span>Transactions are encrypted and processed securely.</span>
        </div>

      </div>

      {/* ✅ TOAST CONTAINER */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}


// import { PayPalButtons } from "@paypal/react-paypal-js";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function Payment() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   // ✅ AMOUNT FROM CHECKOUT
//   const amountInINR = location.state?.amountInINR || 0;
//   const amountInUSD = (amountInINR / 83).toFixed(2);

//   if (!amountInINR) {
//     return <p style={{ textAlign: "center" }}>Invalid payment request</p>;
//   }

//   return (
//     <div style={styles.page}>
//       <div style={styles.wrapper}>

//         {/* HEADER */}
//         <div style={styles.header}>
//           <h2 style={styles.title}>Complete Your Payment</h2>
//           <p style={styles.subtitle}>
//             Secure checkout powered by PayPal Sandbox
//           </p>
//         </div>

//         {/* SUMMARY */}
//         <div style={styles.summaryBox}>
//           <div style={styles.row}>
//             <span style={styles.label}>Order Reference</span>
//             <span style={styles.value}>AUTO-GENERATED</span>
//           </div>

//           <div style={styles.row}>
//             <span style={styles.label}>Amount Payable</span>
//             <span style={styles.amount}>${amountInUSD}</span>
//           </div>

//           <div style={styles.divider}></div>

//           <div style={styles.row}>
//             <span style={styles.smallText}>Payment Method</span>
//             <span style={styles.method}>PayPal / Card</span>
//           </div>
//         </div>

//         <p style={{ fontSize: 13, color: "#686b78", marginBottom: 8 }}>
//           Almost there! Complete payment to place your order 🍔
//         </p>

//         {/* PAYPAL */}
//         <div style={styles.paypalContainer}>
//           <PayPalButtons
//             style={{ layout: "vertical", shape: "rect", label: "pay" }}

//             createOrder={(data, actions) => {
//               return actions.order.create({
//                 purchase_units: [
//                   {
//                     amount: { value: amountInUSD }
//                   }
//                 ]
//               });
//             }}

//             onApprove={(data, actions) => {
//               return actions.order.capture().then(async () => {

//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                   alert("Session expired. Please login again.");
//                   navigate("/login");
//                   return;
//                 }

//                 // 🔥 PLACE ORDERS (MULTI-RESTAURANT)
//                 const response = await fetch(
//                   "http://localhost:9092/orders/place",
//                   {
//                     method: "POST",
//                     headers: {
//                       "Content-Type": "application/json",
//                       Authorization: `Bearer ${token}`
//                     },
//                     body: JSON.stringify({
//                       paypalOrderId: data.orderID
//                     })
//                   }
//                 );

//                 if (!response.ok) {
//                   alert("Order placement failed ❌");
//                   return;
//                 }

//                 // ✅ RECEIVE MULTIPLE ORDERS
//                 const orders = await response.json();

//                 // ✅ BUILD SUCCESS MESSAGE
//                 let message = "🎉 Orders placed successfully:\n\n";
//                 orders.forEach(o => {
//                   message += `• ${o.restaurantName} (₹${o.totalAmount})\n`;
//                 });

//                 alert(message);

//                 // ✅ REDIRECT
//                 navigate("/profile?tab=orders");
//               });
//             }}
//           />
//         </div>

//         {/* FOOTER */}
//         <div style={styles.footerNote}>
//           <span style={styles.lock}>🔒</span>
//           <span>Transactions are encrypted and processed securely.</span>
//         </div>

//       </div>
//     </div>
//   );
// }

/* ===================== STYLES ===================== */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f8f8",
    padding: "24px",
    fontFamily: "'Inter', sans-serif",
  },

  wrapper: {
    width: "420px",
    background: "#ffffff",
    borderRadius: "14px",
    padding: "26px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #f1f1f1",
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#1c1c1c",
  },

  subtitle: {
    marginTop: 6,
    color: "#686b78",
    fontSize: 13,
  },

  summaryBox: {
    background: "#fafafa",
    borderRadius: 10,
    padding: "16px",
    border: "1px dashed #e23744",
    marginBottom: 18,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },

  label: {
    color: "#686b78",
    fontSize: 13,
  },

  value: {
    fontWeight: 600,
    color: "#1c1c1c",
  },

  amount: {
    fontWeight: 700,
    fontSize: 22,
    color: "#e23744",
  },

  divider: {
    height: 1,
    background: "#eee",
    margin: "12px 0",
  },

  smallText: {
    color: "#686b78",
    fontSize: 13,
  },

  method: {
    fontWeight: 600,
    color: "#1c1c1c",
  },

  paypalContainer: {
    marginTop: 10,
    background: "#ffffff",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
  },

  footerNote: {
    marginTop: 16,
    textAlign: "center",
    fontSize: 12,
    color: "#93959f",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  lock: {
    fontSize: 14,
  },
};
