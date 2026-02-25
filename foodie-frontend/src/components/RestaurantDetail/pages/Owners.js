import { useEffect, useState } from "react";
import { getPendingKyc } from "../services/AdminService";
import { useNavigate } from "react-router-dom";

export default function Owners() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPendingKyc().then(res => setList(res.data));
  }, []);

  return (
    <div className="owners-page">
      <h2>Pending Approvals</h2>

      <table className="owners-table">
        <thead>
          <tr>
            <th>Restaurant</th>
            <th>Email</th>
            <th>City</th>
            <th>Status</th>
            <th>View</th>
          </tr>
        </thead>

        <tbody>
          {list.map(r => (
            <tr key={r.id}>
              <td>{r.restaurantName}</td>
              <td>{r.ownerEmail}</td>
              <td>{r.city}</td>
              <td>{r.status}</td>
              <td>
                <button className="view-btn" onClick={() => navigate(`/admin/owners/${r.id}`)}>
                  View KYC
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
