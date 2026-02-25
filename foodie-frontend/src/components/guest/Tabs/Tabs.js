import { useLocation, useNavigate } from "react-router-dom";
import "./Tabs.css";

export default function Tabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      label: "Dining Out",
      path: "/dining",
      image:
        "https://cdn-icons-png.flaticon.com/512/1046/1046784.png", // dining
    },
    {
      label: "Delivery",
      path: "/delivery",
      image:
        "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", // delivery
    },
    {
      label: "Nightlife",
      path: "/nightlife",
      image:
        "https://cdn-icons-png.flaticon.com/512/2935/2935416.png", // nightlife
    },
  ];

  return (
    <div className="tabs-wrapper">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;

        return (
          <div
            key={tab.path}
            className={`tab-item ${isActive ? "active" : ""}`}
            onClick={() => navigate(tab.path)}
          >
            <div className={`tab-icon ${isActive ? "active-icon" : ""}`}>
              <img src={tab.image} alt={tab.label} />
            </div>

            <span className="tab-label">{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
}
