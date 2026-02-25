import "./OrderDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const restaurantId = localStorage.getItem("restaurantId");

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ORDER ================= */
  const fetchOrder = async () => {
    if (!token || !restaurantId) return;

    try {
      const res = await axios.get(
        `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const found = res.data.find(o => o.id === id);
      setOrder(found || null);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  /* ================= UPDATE STATUS ================= */
  const updateStatus = async (newStatus) => {
    try {
      await axios.put(
        `http://localhost:9092/restaurant/orders/${id}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchOrder();
    } catch (err) {
      console.error("Status update failed", err);
      alert("Failed to update order status");
    }
  };

  if (loading) return <p className="loading">Loading order details...</p>;
  if (!order) return <p className="error">Order not found</p>;

  /* ================= TIMELINE ================= */
  const timeline = [
    { label: "Order placed", done: true },
    { label: "Accepted by restaurant", done: ["PREPARING", "READY", "DELIVERED"].includes(order.orderStatus) },
    { label: "Preparing", done: ["PREPARING", "READY", "DELIVERED"].includes(order.orderStatus) },
    { label: "Ready for pickup", done: ["READY", "DELIVERED"].includes(order.orderStatus) },
  ];

  return (
    <div className="order-details-page">
      {/* BACK */}
      <button className="back-link" onClick={() => navigate(-1)}>
        ← Live Orders
      </button>

      {/* HEADER */}
      <div className="order-header">
        <div>
          <h1>Order #{order.id}</h1>
          <span className="meta-text">
            Placed at{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString()
              : "--"}
          </span>
        </div>

        {order.orderStatus === "PREPARING" && (
          <button
            className="primary-action"
            onClick={() => updateStatus("READY")}
          >
            Mark as Ready
          </button>
        )}
      </div>

      {/* BODY */}
      <div className="order-layout">
        {/* LEFT */}
        <div className="left-column">
          {/* ITEMS */}
          <div className="panel">
            <h2>Items</h2>

            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th align="right">Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.itemName}</td>
                    <td>{item.quantity}</td>
                    <td align="right">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* INSTRUCTIONS */}
          {order.instructions && (
            <div className="instruction-box">
              <strong>Special instructions</strong>
              <p>{order.instructions}</p>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="right-column">
          {/* SUMMARY */}
          <div className="panel compact">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>

          {/* TIMELINE */}
          <div className="panel compact">
            <h2>Order Timeline</h2>

            <ul className="timeline">
              {timeline.map((step, i) => (
                <li key={i} className={step.done ? "done" : ""}>
                  <span className="dot" />
                  <div>
                    <div className="label">{step.label}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
