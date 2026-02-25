import React from "react";

const SortDropdown = ({ value, onChange }) => {
  return (
    <div className="filter-item">
      <label>Sort By</label>
      <select
        value={value || "rating"}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="rating">Rating</option>
        <option value="price_low">Price: Low to High</option>
        <option value="price_high">Price: High to Low</option>
        <option value="delivery_time">Delivery Time</option>
      </select>
    </div>
  );
};

export default SortDropdown;
