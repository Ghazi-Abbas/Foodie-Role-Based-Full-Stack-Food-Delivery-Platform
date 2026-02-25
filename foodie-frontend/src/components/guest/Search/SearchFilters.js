// import React from "react";
// import "./SearchPage.css";

// const SearchFilters = ({ filters, onChange }) => {
//   return (
//     <div className="zomato-filter-bar">

//       {/* Veg */}
//       <button
//         className={`filter-chip ${filters.veg === "true" ? "active" : ""}`}
//         onClick={() =>
//           onChange("veg", filters.veg === "true" ? null : "true")
//         }
//       >
//         Veg
//       </button>

//       {/* Non-Veg */}
//       <button
//         className={`filter-chip ${filters.veg === "false" ? "active" : ""}`}
//         onClick={() =>
//           onChange("veg", filters.veg === "false" ? null : "false")
//         }
//       >
//         Non-Veg
//       </button>

//       {/* Category */}
//       <button
//         className={`filter-chip ${filters.category ? "active" : ""}`}
//         onClick={() =>
//           onChange("category", filters.category ? null : "Biryani")
//         }
//       >
//         Category
//       </button>

//       {/* Rating */}
//       <button
//         className={`filter-chip ${filters.rating ? "active" : ""}`}
//         onClick={() =>
//           onChange("rating", filters.rating ? null : "4")
//         }
//       >
//         Rating 4.0+
//       </button>

//       {/* Sort */}
//       <button
//         className={`filter-chip ${filters.sort !== "rating" ? "active" : ""}`}
//         onClick={() =>
//           onChange(
//             "sort",
//             filters.sort === "price_low" ? "price_high" : "price_low"
//           )
//         }
//       >
//         Sort
//       </button>

//     </div>
//   );
// };

// export default SearchFilters;
// import React from "react";
// import "./SearchPage.css";

// const SearchFilters = ({ filters, onChange }) => {
//   const categories = ["Biryani", "Snacks", "Beverages", "Dessert"];

//   return (
//     <div className="zomato-filter-bar">

//       {/* ================= VEG / NON-VEG ================= */}

//       <button
//         className={`filter-chip ${filters.veg === "true" ? "active" : ""}`}
//         onClick={() =>
//           onChange("veg", filters.veg === "true" ? null : "true")
//         }
//       >
//         Veg
//       </button>

//       <button
//         className={`filter-chip ${filters.veg === "false" ? "active" : ""}`}
//         onClick={() =>
//           onChange("veg", filters.veg === "false" ? null : "false")
//         }
//       >
//         Non-Veg
//       </button>

//       {/* ================= CATEGORIES ================= */}

//       {categories.map((cat) => (
//         <button
//           key={cat}
//           className={`filter-chip ${
//             filters.category === cat ? "active" : ""
//           }`}
//           onClick={() =>
//             onChange(
//               "category",
//               filters.category === cat ? null : cat
//             )
//           }
//         >
//           {cat}
//         </button>
//       ))}

//       {/* ================= RATING ================= */}

//       <button
//         className={`filter-chip ${filters.rating === "4" ? "active" : ""}`}
//         onClick={() =>
//           onChange("rating", filters.rating === "4" ? null : "4")
//         }
//       >
//         Rating 4.0+
//       </button>

//       {/* ================= SORT ================= */}

//       <button
//         className={`filter-chip ${
//           filters.sort === "price_low" ||
//           filters.sort === "price_high"
//             ? "active"
//             : ""
//         }`}
//         onClick={() =>
//           onChange(
//             "sort",
//             filters.sort === "price_low"
//               ? "price_high"
//               : "price_low"
//           )
//         }
//       >
//         Price {filters.sort === "price_high" ? "↓" : "↑"}
//       </button>

//     </div>
//   );
// };

// export default SearchFilters;
import React from "react";
import "./SearchPage.css";

const SearchFilters = ({ filters, onChange }) => {
  return (
    <div className="zomato-filter-bar">

      {/* ================= VEG / NON-VEG ================= */}

      <button
        className={`filter-chip ${filters.veg === "true" ? "active" : ""}`}
        onClick={() =>
          onChange("veg", filters.veg === "true" ? null : "true")
        }
      >
        Veg
      </button>

      <button
        className={`filter-chip ${filters.veg === "false" ? "active" : ""}`}
        onClick={() =>
          onChange("veg", filters.veg === "false" ? null : "false")
        }
      >
        Non-Veg
      </button>

      {/* ================= RATING ================= */}

      <button
        className={`filter-chip ${filters.rating === "4" ? "active" : ""}`}
        onClick={() =>
          onChange("rating", filters.rating === "4" ? null : "4")
        }
      >
        Rating 4.0+
      </button>

      {/* ================= SORT ================= */}

      <button
        className={`filter-chip ${
          filters.sort === "price_low" ||
          filters.sort === "price_high"
            ? "active"
            : ""
        }`}
        onClick={() =>
          onChange(
            "sort",
            filters.sort === "price_low"
              ? "price_high"
              : "price_low"
          )
        }
      >
        Price {filters.sort === "price_high" ? "↓" : "↑"}
      </button>

    </div>
  );
};

export default SearchFilters;
