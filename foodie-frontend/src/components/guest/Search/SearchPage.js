// // pages/Search/SearchPage.js
// import React, { useEffect, useCallback } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import SearchFilters from "./SearchFilters";
// import SearchResults from "./SearchResults";
// import "./SearchPage.css";

// const SearchPage = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const query = searchParams.get("q") || "";

//   const filters = {
//     veg: searchParams.get("veg"),
//     category: searchParams.get("category"),
//     rating: searchParams.get("rating"),
//     sort: searchParams.get("sort") || "rating",
//   };

//   // 🔁 redirect if empty search
//   useEffect(() => {
//     if (!query.trim()) {
//       navigate("/delivery", { replace: true });
//     }
//   }, [query, navigate]);

//   const updateFilter = (key, value) => {
//     const params = Object.fromEntries(searchParams.entries());
//     if (!value) delete params[key];
//     else params[key] = value;
//     setSearchParams(params);
//   };

//   // ✅ item click → item details (STABLE + SAFE)
//   const handleItemClick = useCallback(
//     (restaurantId, itemId) => {
//       if (!restaurantId || !itemId) {
//         console.warn("❌ Missing navigation params", {
//           restaurantId,
//           itemId,
//         });
//         return;
//       }

//       console.log(
//         "➡️ Navigating to item details:",
//         restaurantId,
//         itemId
//       );

//       navigate(`/restaurant/${restaurantId}/item/${itemId}`);
//     },
//     [navigate]
//   );

//   return (
//     <div className="zomato-shell search-page">
//       {/* 🔍 HEADER */}
//       <div className="search-header">
//         <h2>
//           Showing results for <span>“{query}”</span>
//         </h2>
//         <p className="search-subtext">
//           Discover the best dishes from restaurants near you
//         </p>
//       </div>

//       {/* 🎛 FILTERS */}
//       <SearchFilters
//         filters={filters}
//         onChange={updateFilter}
//       />

//       {/* 🍽 RESULTS */}
//       <SearchResults
//         query={query}
//         filters={filters}
//         onItemClick={handleItemClick} // 🔥 MUST be used inside SearchResults
//       />
//     </div>
//   );
// };

// export default SearchPage;
// pages/Search/SearchPage.js
import React, { useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import SearchFilters from "./SearchFilters";
import SearchResults from "./SearchResults";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /* ================= QUERY ================= */

  const query = searchParams.get("q") || "";

  /* ================= FILTERS ================= */

  const filters = {
    veg: searchParams.get("veg"),              // "true" | "false" | null
    category: searchParams.get("category"),    // Biryani | Snacks | etc
    rating: searchParams.get("rating"),        // "4" | null
    sort: searchParams.get("sort") || "rating" // price_low | price_high | rating
  };

  /* ================= REDIRECT IF EMPTY SEARCH ================= */

  useEffect(() => {
    if (!query.trim()) {
      navigate("/delivery", { replace: true });
    }
  }, [query, navigate]);

  /* ================= UPDATE FILTER ================= */

  const updateFilter = (key, value) => {
    const params = Object.fromEntries(searchParams.entries());

    if (!value) {
      delete params[key];        // remove filter
    } else {
      params[key] = value;       // set / update filter
    }

    setSearchParams(params);
  };

  /* ================= ITEM CLICK HANDLER ================= */

  const handleItemClick = useCallback(
    (restaurantId, itemId) => {
      if (!restaurantId || !itemId) {
        console.warn("❌ Missing navigation params", {
          restaurantId,
          itemId,
        });
        return;
      }

      console.log(
        "➡️ Navigating to item details:",
        restaurantId,
        itemId
      );

      navigate(`/restaurant/${restaurantId}/item/${itemId}`);
    },
    [navigate]
  );

  /* ================= UI ================= */

  return (
    <div className="zomato-shell search-page">

      {/* 🔍 HEADER */}
      <div className="search-header">
        <h2>
          Showing results for <span>“{query}”</span>
        </h2>
        <p className="search-subtext">
          Discover the best dishes from restaurants near you
        </p>
      </div>

      {/* 🎛 FILTER BAR */}
      <SearchFilters
        filters={filters}
        onChange={updateFilter}
      />

      {/* 🍽 SEARCH RESULTS */}
      <SearchResults
        query={query}
        filters={filters}
        onItemClick={handleItemClick}
      />

    </div>
  );
};

export default SearchPage;
