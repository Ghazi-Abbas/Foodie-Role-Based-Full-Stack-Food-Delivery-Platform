import React from "react";

const RatingFilter = ({ value, onChange }) => {
  return (
    <div className="filter-item">
      <label>Rating</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">All</option>
        <option value="4">4.0+</option>
        <option value="4.5">4.5+</option>
      </select>
    </div>
  );
};

export default RatingFilter;
