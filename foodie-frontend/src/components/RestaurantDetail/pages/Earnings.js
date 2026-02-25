import "./Earnings.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Earnings() {
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    pendingSettlement: 0,
  });

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= FETCH EARNINGS ================= */
  const fetchEarnings = async () => {
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

      const orders = Array.isArray(res.data) ? res.data : [];

      const now = new Date();
      let today = 0,
        week = 0,
        month = 0,
        pending = 0;

      const txns = [];

      orders.forEach((order) => {
        if (!order.createdAt) return;

        const date = new Date(order.createdAt);
        const amount = order.totalAmount || 0;
        const status = order.orderStatus || "UNKNOWN";

        const isToday =
          date.toDateString() === now.toDateString();

        const isThisWeek =
          (now - date) / (1000 * 60 * 60 * 24) <= 7;

        const isThisMonth =
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear();

        if (status === "DELIVERED") {
          if (isToday) today += amount;
          if (isThisWeek) week += amount;
          if (isThisMonth) month += amount;
        }

        if (status !== "DELIVERED") {
          pending += amount;
        }

        txns.push({
          id: order.id,
          orderId: order.id,
          date: date.toLocaleString(),
          gross: amount,
          commission: Math.round(amount * 0.1),
          net: Math.round(amount * 0.9),
          status: status === "DELIVERED" ? "SETTLED" : "PENDING",
        });
      });

      setSummary({
        today,
        week,
        month,
        pendingSettlement: pending,
      });

      setTransactions(txns.reverse());
    } catch (err) {
      console.error("Failed to load earnings", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  /* ================= UI ================= */

  if (loading) {
    return <p className="loading">Loading earnings...</p>;
  }

  return (
    <div className="earnings-page">
      {/* HEADER */}
      <div className="earnings-header">
        <div>
          <h1>Earnings</h1>
          <p>Track your revenue and settlements</p>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="earnings-summary">
        <div className="summary-card">
          <span className="label">Today</span>
          <span className="value">₹{summary.today}</span>
        </div>

        <div className="summary-card">
          <span className="label">This Week</span>
          <span className="value">₹{summary.week}</span>
        </div>

        <div className="summary-card">
          <span className="label">This Month</span>
          <span className="value">₹{summary.month}</span>
        </div>

        <div className="summary-card highlight">
          <span className="label">Pending Settlement</span>
          <span className="value">
            ₹{summary.pendingSettlement}
          </span>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="panel">
        <h2>Transaction History</h2>

        <table className="earnings-table">
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Order</th>
              <th>Date</th>
              <th align="right">Gross</th>
              <th align="right">Commission</th>
              <th align="right">Net</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((txn) => (
              <tr key={txn.id}>
                <td className="txn-id">{txn.id}</td>
                <td>{txn.orderId}</td>
                <td>{txn.date}</td>
                <td align="right">₹{txn.gross}</td>
                <td align="right">₹{txn.commission}</td>
                <td align="right" className="net">
                  ₹{txn.net}
                </td>
                <td>
                  <span
                    className={`status ${
                      txn.status === "SETTLED"
                        ? "settled"
                        : "pending"
                    }`}
                  >
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  No transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
