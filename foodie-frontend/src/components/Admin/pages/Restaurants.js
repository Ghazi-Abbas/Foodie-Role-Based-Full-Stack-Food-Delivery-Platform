import { useEffect, useState } from "react";
import {
  getAllRestaurants,
  goLive,
  goOffline
} from "../services/AdminService";
import { useNavigate } from "react-router-dom";
import "../admin.css";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const navigate = useNavigate();

  const load = () => {
    getAllRestaurants().then(res => setRestaurants(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const totalPages = Math.ceil(restaurants.length / perPage);

  const paginated = restaurants.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <>
      <h1>Restaurants Management</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Status</th>
            <th>Live</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map(r => (
            <tr key={r.id}>
              <td>{r.restaurantName}</td>

              <td>
                <span className={`status ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </td>

              <td>
                <span className={r.active ? "live" : "offline"}>
                  {r.active ? "LIVE" : "OFF"}
                </span>
              </td>

              <td className="actions">
                <button
                  className="btn btn-view"
                  onClick={() => navigate(`/admin/owners/${r.id}`)}
                >
                  View KYC
                </button>

                {r.active ? (
                  <button
                    className="btn btn-off"
                    onClick={() => goOffline(r.id).then(load)}
                  >
                    Go Offline
                  </button>
                ) : (
                  <button
                    className="btn btn-live"
                    disabled={r.status !== "APPROVED"}
                    onClick={() => goLive(r.id).then(load)}
                  >
                    Go Live
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ‹ Prev
        </button>

        <span>Page {page} of {totalPages}</span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ›
        </button>
      </div>
    </>
  );
}
