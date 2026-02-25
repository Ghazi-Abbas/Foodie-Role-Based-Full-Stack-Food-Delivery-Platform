import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiShoppingBag,
  FiBarChart2,
  FiTruck,
  FiCreditCard,
  FiLogOut
} from "react-icons/fi";
import "../admin.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <span className="brand-dot" />
        <h2>Foodie</h2>
        <small>Admin Panel</small>
      </div>

      {/* NAV */}
      <nav className="sidebar-nav">
        <NavLink to="/admin/dashboard">
          <FiHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/owners">
          <FiUsers />
          <span>Owners</span>
        </NavLink>

        <NavLink to="/admin/restaurants">
          <FiShoppingBag />
          <span>Restaurants</span>
        </NavLink>

        <NavLink to="/admin/analytics">
          <FiBarChart2 />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/admin/delivery-agents">
          <FiTruck />
          <span>Delivery Agents</span>
        </NavLink>

        <NavLink to="/admin/memberships">
          <FiCreditCard />
          <span>Memberships</span>
        </NavLink>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}
