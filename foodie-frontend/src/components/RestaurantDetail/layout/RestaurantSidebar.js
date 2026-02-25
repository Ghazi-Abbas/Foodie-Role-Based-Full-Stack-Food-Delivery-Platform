import { NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBookOpen,
  FiShoppingCart,
  FiList,
  FiBarChart2,
  FiDollarSign,
  FiSettings,
  FiLogOut,
  FiStar
} from "react-icons/fi";
import "../restaurant.css";

export default function RestaurantSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <aside className="admin-sidebar">
      {/* BRAND */}
      <div className="sidebar-brand"  onClick={() => navigate("/")}>
        <span className="brand-dot" />
        <h2 >Foodie</h2>
        <small>Restaurant Partner</small>
      </div>

      {/* NAVIGATION */}
      <nav className="sidebar-nav">
        <NavLink to="/restaurant-dashboard/dashboard">
          <FiHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/restaurant-dashboard/status">
          <FiBookOpen />
          <span>Restaurant Status</span>
        </NavLink>

        <NavLink to="/restaurant-dashboard/live-orders">
          <FiShoppingCart />
          <span>Live Orders</span>
        </NavLink>

       <NavLink to="/restaurant-dashboard/orders" end>
          <FiList />
          <span>Order History</span>
        </NavLink>

        <NavLink to="/restaurant-dashboard/menu">
          <FiBookOpen />
          <span>Menu Management</span>
        </NavLink>
          
          <NavLink to="/restaurant-dashboard/reviews" end>
          <FiStar/>
        
             Reviews & Ratings
           </NavLink>
        <NavLink to="/restaurant-dashboard/earnings">
          <FiDollarSign />
          <span>Earnings</span>
        </NavLink>

        <NavLink to="/restaurant-dashboard/analytics">
          <FiBarChart2 />
          <span>Analytics</span>
        </NavLink>

        <NavLink to="/restaurant-dashboard/settings">
          <FiSettings />
          <span>Settings</span>
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
