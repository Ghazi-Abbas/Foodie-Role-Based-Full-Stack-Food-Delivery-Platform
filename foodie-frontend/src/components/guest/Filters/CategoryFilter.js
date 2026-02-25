import React from "react";

const categories = [
  "Biryani",
  "Pizza",
  "Burger",
  "Chinese",
  "Snacks",
  "Desserts",
  "South Indian",
  "North Indian",
];

const CategoryFilter = ({ value, onChange }) => {
  return (
    <div className="filter-item">
      <label>Category</label>
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || null)}
      >
        <option value="">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
