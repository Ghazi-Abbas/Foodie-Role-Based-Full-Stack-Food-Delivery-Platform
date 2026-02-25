import "./OrderHistory.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderHistory() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    if (!restaurantId || !token) {
      console.warn("Missing restaurantId or token");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:9092/restaurant/dashboard/orders/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load order history", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ================= FILTER ================= */
  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter(
          (o) =>
            o.orderStatus &&
            (filter === "COMPLETED"
              ? o.orderStatus === "DELIVERED"
              : o.orderStatus === "CANCELLED")
        );

  /* ================= UI ================= */

  if (loading) {
    return <p className="loading">Loading order history...</p>;
  }

  return (
    <div className="order-history-page">
      {/* HEADER */}
      <div className="order-history-header">
        <div>
          <h1>Order History</h1>
          <p>All completed and cancelled orders</p>
        </div>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All Orders</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="panel">
        <table className="history-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Items</th>
              <th align="right">Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.map((order) => {
              const status = order.orderStatus || "UNKNOWN";

              return (
                <tr
                  key={order.id}
                  className="clickable-row"
                  onClick={() =>
                    navigate(
                      `/restaurant-dashboard/orders/${order.id}`
                    )
                  }
                >
                  <td className="order-id">#{order.id}</td>

                  <td>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString()
                      : "--"}
                  </td>

                  <td className="items">
                    {Array.isArray(order.items)
                      ? order.items
                          .map(
                            (i) =>
                              `${i.quantity || 1}× ${i.itemName}`
                          )
                          .join(", ")
                      : "—"}
                  </td>

                  <td align="right">
                    ₹{order.totalAmount ?? 0}
                  </td>

                  <td>
                    <span
                      className={`status-pill ${status.toLowerCase()}`}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
