import React from "react";

const VegToggle = ({ value, onChange }) => {
  return (
    <div className="filter-item">
      <label>
        <input
          type="checkbox"
          checked={value === "true"}
          onChange={(e) =>
            onChange(e.target.checked ? "true" : null)
          }
        />
        <span style={{ marginLeft: 8 }}>Pure Veg</span>
      </label>
    </div>
  );
};

export default VegToggle;
