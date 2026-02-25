// // pages/Search/SearchResults.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./SearchResults.css";

// const API = "http://localhost:9092/api/search";

// const SearchResults = ({ query, filters, onItemClick }) => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!query) return;

//     const fetchResults = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(API, {
//           params: {
//             q: query,
//             veg: filters.veg,
//             category: filters.category,
//             minRating: filters.rating,
//             sort: filters.sort,
//           },
//         });
//         setItems(res.data || []);
//       } catch (e) {
//         setItems([]);
//       }
//       setLoading(false);
//     };

//     fetchResults();
//   }, [query, filters]);

//   if (loading) {
//     return <p className="loading-text">Searching delicious food…</p>;
//   }

//   if (!items.length) {
//     return <p className="no-results">No dishes found 😔</p>;
//   }

//   return (
//     <div className="search-grid">
//       {items.map((item) => (
//         <div
//           className="food-card"
//           key={item.itemId}
//           onClick={() =>
//             onItemClick?.(item.restaurantId, item.itemId)
//           }
//           style={{ cursor: "pointer" }}
//         >
//           <div className="food-image">
//             <img src={item.imageUrl} alt={item.itemName} />
//             <span
//               className={`veg-dot ${
//                 item.veg ? "veg" : "nonveg"
//               }`}
//             />
//           </div>

//           <div className="food-body">
//             <h4>{item.itemName}</h4>

//             <div className="food-meta">
//               <span className="rating">
//                 ⭐ {item.rating || "New"}
//               </span>
//               <span className="price">₹{item.price}</span>
//             </div>

//             <p className="restaurant-name">
//               {item.restaurantName}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchResults;
// import React, { useEffect, useState, useMemo } from "react";
// import axios from "axios";
// import "./SearchResults.css";

// const SearchResults = ({ query, filters, onItemClick }) => {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH ================= */

//   useEffect(() => {
//     const fetchResults = async () => {
//       setLoading(true);
//       try {
//         const res = await axios.get(
//           "http://localhost:9092/api/search",
//           { params: { q: query } }
//         );
//         setItems(Array.isArray(res.data) ? res.data : []);
//       } catch (err) {
//         console.error("Search failed", err);
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [query]);

//   /* ================= APPLY FILTERS + SORT ================= */

//   const processedItems = useMemo(() => {
//     let data = [...items];

//     // 🟢 VEG / NON-VEG
//     if (filters.veg === "true") {
//       data = data.filter(i => i.veg === true);
//     }
//     if (filters.veg === "false") {
//       data = data.filter(i => i.veg === false);
//     }

//     // ⭐ RATING 4+
//     if (filters.rating === "4") {
//       data = data.filter(i => (i.rating || 0) >= 4);
//     }

//     // 💰 PRICE SORT
//     if (filters.sort === "price_low") {
//       data.sort((a, b) => (a.price || 0) - (b.price || 0));
//     }

//     if (filters.sort === "price_high") {
//       data.sort((a, b) => (b.price || 0) - (a.price || 0));
//     }

//     return data;
//   }, [items, filters]);

//   /* ================= UI ================= */

//   if (loading) return <p>Loading...</p>;

//   if (processedItems.length === 0) {
//     return <p>No results found</p>;
//   }

//   return (
//     <div className="search-results-grid">
//       {processedItems.map(item => (
//         <div
//           key={item.id}
//           className="food-card"
//           onClick={() =>
//             onItemClick(item.restaurantId, item.id)
//           }
//         >
//           <h4>{item.name}</h4>
//           <p>₹{item.price}</p>
//           <p>⭐ {item.rating || "N/A"}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SearchResults;
// pages/Search/SearchResults.js
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./SearchResults.css";

const API = "http://localhost:9092/api/search";

const SearchResults = ({ query, filters, onItemClick }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH ================= */

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API, {
          params: { q: query },
        });
        setItems(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Search failed", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  /* ================= APPLY FILTERS + SORT ================= */

  const processedItems = useMemo(() => {
    let data = [...items];

    // 🟢 VEG / NON-VEG
    if (filters.veg === "true") {
      data = data.filter(i => i.veg === true);
    }
    if (filters.veg === "false") {
      data = data.filter(i => i.veg === false);
    }

    // ⭐ RATING 4+
    if (filters.rating === "4") {
      data = data.filter(i => (i.rating || 0) >= 4);
    }

    // 💰 PRICE SORT
    if (filters.sort === "price_low") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    if (filters.sort === "price_high") {
      data.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return data;
  }, [items, filters]);

  /* ================= UI ================= */

  if (loading) {
    return <p className="loading-text">Searching delicious food…</p>;
  }

  if (!processedItems.length) {
    return <p className="no-results">No dishes found 😔</p>;
  }

  return (
    <div className="search-grid">
      {processedItems.map((item) => (
        <div
          key={item.itemId}   // ✅ FIXED
          className="food-card"
          onClick={() =>
            onItemClick?.(item.restaurantId, item.itemId)
          }
          style={{ cursor: "pointer" }}
        >
          <div className="food-image">
            <img src={item.imageUrl} alt={item.itemName} />
            <span
              className={`veg-dot ${item.veg ? "veg" : "nonveg"}`}
            />
          </div>

          <div className="food-body">
            <h4>{item.itemName}</h4>

            <div className="food-meta">
              <span className="rating">
                ⭐ {item.rating || "New"}
              </span>
              <span className="price">₹{item.price}</span>
            </div>

            <p className="restaurant-name">
              {item.restaurantName}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
