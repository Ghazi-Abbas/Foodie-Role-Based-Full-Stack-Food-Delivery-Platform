// components/Delivery/DeliveryFilters.js
import "./DeliveryFilters.css";

export default function DeliveryFilters({ onFilter }) {
  return (
    <div className="filter-bar">
      <button onClick={() => onFilter("VEG")}>Veg</button>
      <button onClick={() => onFilter("NON_VEG")}>Non-Veg</button>
      <button onClick={() => onFilter("OPEN")}>Open Now</button>
      <button onClick={() => onFilter("RATING")}>Rating 4+</button>
      <button onClick={() => onFilter("CLEAR")}>Clear</button>
    </div>
  );
}
