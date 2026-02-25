import { useNavigate } from "react-router-dom";
import "./RestaurantCard.css";

export default function RestaurantCard({ data }) {
  const navigate = useNavigate();

  if (!data) return null;

  return (
    <div
      className="restaurant-card"
      onClick={() => navigate(`/restaurant/${data.id}`)}
    >
      {/* IMAGE */}
      <div className="image-wrapper">
        <img
          src={data.imageUrl || "/placeholder-restaurant.jpg"}
          alt={data.name}
        />

        {/* OPEN BADGE */}
        {data.open && <span className="open-badge">Open</span>}
      </div>

      {/* CONTENT */}
      <div className="content">
        <div className="title-row">
          <h4 className="restaurant-name">{data.name}</h4>
        </div>

        {/* LOCATION */}
        <p className="location">
          {data.city}
          {data.address ? ` • ${data.address}` : ""}
        </p>

        {/* TIMING */}
        <p className={`timing ${data.open ? "open" : "closed"}`}>
          {data.open
            ? `Open now • Closes at ${formatTime(data.closingTime)}`
            : `Closed • Opens at ${formatTime(data.openingTime)}`}
        </p>
      </div>
    </div>
  );
}

/* ================= HELPER ================= */
function formatTime(time) {
  if (!time) return "";

  const [h, m] = time.split(":");
  const hour = Number(h);
  const minute = m || "00";

  const suffix = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedHour}:${minute} ${suffix}`;
}
