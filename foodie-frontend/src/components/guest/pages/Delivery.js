// import { useEffect, useState } from "react";
// import api from "../api/axios";

// import OfferBanner from "../Banner/OfferBanner";
// import FoodCategoryRow from "../Delivery/FoodCategory";
// import FoodDiscoveryRow from "./FoodDiscoveryRow";
// import DeliveryFilters from "./DeliveryFilters";

// import BrandSkeleton from "../Skeleton/BrandSkeleton";
// import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";
// import BrandCard from "../Delivery/BrandCard";
// import RestaurantCard from "../Restaurants/RestaurantCard";



// export default function Delivery() {
//   const [loading, setLoading] = useState(true);
//   const [restaurants, setRestaurants] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [error, setError] = useState(null);

//   // 🔥 Discovery sections
//   const [vegItems, setVegItems] = useState([]);
//   const [nonVegItems, setNonVegItems] = useState([]);
//   const [snacks, setSnacks] = useState([]);
//   const [desserts, setDesserts] = useState([]);
//   const [beverages, setBeverages] = useState([]);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // ================= FETCH ALL =================

//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const [
//         restaurantsRes,
//         vegRes,
//         nonVegRes,
//         snacksRes,
//         dessertRes,
//         beverageRes,
//       ] = await Promise.all([
//         api.get("/api/guest/restaurants"),
//         api.get("/api/guest/restaurants/menu/veg"),
//         api.get("/api/guest/restaurants/menu/non-veg"),
//         api.get("/api/guest/restaurants/menu/snacks"),
//         api.get("/api/guest/restaurants/menu/desserts"),
//         api.get("/api/guest/restaurants/menu/beverages"),
//       ]);

//       setRestaurants(restaurantsRes.data);
//       setFilteredRestaurants(restaurantsRes.data);

//       setVegItems(vegRes.data);
//       setNonVegItems(nonVegRes.data);
//       setSnacks(snacksRes.data);
//       setDesserts(dessertRes.data);
//       setBeverages(beverageRes.data);

//     } catch (err) {
//       console.error("Delivery page load failed", err);
//       setError("Failed to load delivery data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FILTER LOGIC =================

//   const handleFilter = (type) => {
//     if (type === "CLEAR") {
//       setFilteredRestaurants(restaurants);
//       return;
//     }

//     if (type === "OPEN") {
//       setFilteredRestaurants(restaurants.filter(r => r.open));
//       return;
//     }

//     if (type === "ACTIVE") {
//       setFilteredRestaurants(restaurants.filter(r => r.active));
//       return;
//     }
//   };

//   // ================= UI =================

//   return (
//     <div className="page">

//       {/* 🔥 OFFER BANNER */}
//       <OfferBanner />

//       {/* 🍕 FOOD INSPIRATION
//       <FoodCategoryRow categories={foodCategories} />

//       {/* 🏪 TOP BRANDS */}
//       {/* <h2>Top brands for you</h2>
//       <div className="brand-row">
//         {loading
//           ? Array.from({ length: 6 }).map((_, i) => (
//               <BrandSkeleton key={i} />
//             ))
//           : brands.map((b) => (
//               <BrandCard key={b.id} brand={b} />
//             ))}
//       </div>  */}

//       {/* 🍽️ DISCOVERY SECTIONS */}
//       {!loading && (
//         <>
//           <FoodDiscoveryRow title="Pure Veg Picks" items={vegItems} />
//           <FoodDiscoveryRow title="Non-Veg Favourites" items={nonVegItems} />
//           <FoodDiscoveryRow title="Snacks Near You" items={snacks} />
//           <FoodDiscoveryRow title="Desserts You’ll Love" items={desserts} />
//           <FoodDiscoveryRow title="Beverages & Drinks" items={beverages} />
//         </>
//       )}

//       {/* 🎛️ FILTER BAR */}
//       <DeliveryFilters onFilter={handleFilter} />

//       {/* 🍽️ RESTAURANTS */}
//       <h2>Food Delivery Restaurants in Lucknow</h2>

//       {error && <p className="error-text">{error}</p>}

//       <div className="restaurant-grid">
//         {loading
//           ? Array.from({ length: 6 }).map((_, i) => (
//               <RestaurantSkeleton key={i} />
//             ))
//           : filteredRestaurants.map((res) => (
//               <RestaurantCard key={res.id} data={res} />
//             ))}
//       </div>

//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import api from "../api/axios";

// import OfferBanner from "../Banner/OfferBanner";
// import FoodDiscoveryRow from "./FoodDiscoveryRow";
// import DeliveryFilters from "./DeliveryFilters";

// import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";
// import RestaurantCard from "../Restaurants/RestaurantCard";
// import FoodItemCard from "./FoodItemCard";

// import "./Delivery.css"; // 🔥 IMPORTANT

// export default function Delivery() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [feed, setFeed] = useState([]);
//   const [filteredFeed, setFilteredFeed] = useState([]);

//   const [vegItems, setVegItems] = useState([]);
//   const [nonVegItems, setNonVegItems] = useState([]);
//   const [snacks, setSnacks] = useState([]);
//   const [desserts, setDesserts] = useState([]);
//   const [beverages, setBeverages] = useState([]);

//   useEffect(() => {
//     fetchAllData();
//   }, []);

//   // ================= BUILD MIXED FEED =================
//   const buildFeed = (restaurants, foods) => {
//     const restaurantFeed = restaurants.map(r => ({
//       type: "RESTAURANT",
//       data: r
//     }));

//     const foodFeed = foods.map(f => ({
//       type: "FOOD",
//       data: f
//     }));

//     return [...restaurantFeed, ...foodFeed].sort(
//       () => Math.random() - 0.5
//     );
//   };

//   // ================= FETCH DATA =================
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);

//       const [
//         restaurantsRes,
//         vegRes,
//         nonVegRes,
//         snacksRes,
//         dessertRes,
//         beverageRes
//       ] = await Promise.all([
//         api.get("/api/guest/restaurants"),
//         api.get("/api/guest/restaurants/menu/veg"),
//         api.get("/api/guest/restaurants/menu/non-veg"),
//         api.get("/api/guest/restaurants/menu/snacks"),
//         api.get("/api/guest/restaurants/menu/desserts"),
//         api.get("/api/guest/restaurants/menu/beverages")
//       ]);

//       const foods = [
//         ...vegRes.data,
//         ...nonVegRes.data,
//         ...snacksRes.data,
//         ...dessertRes.data,
//         ...beverageRes.data
//       ];

//       setVegItems(vegRes.data);
//       setNonVegItems(nonVegRes.data);
//       setSnacks(snacksRes.data);
//       setDesserts(dessertRes.data);
//       setBeverages(beverageRes.data);

//       const mixed = buildFeed(restaurantsRes.data, foods);
//       setFeed(mixed);
//       setFilteredFeed(mixed);

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load delivery data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= FILTER =================
//   const handleFilter = (type) => {
//     if (type === "CLEAR") return setFilteredFeed(feed);

//     if (type === "OPEN") {
//       return setFilteredFeed(
//         feed.filter(f => f.type !== "RESTAURANT" || f.data.open)
//       );
//     }

//     if (type === "ACTIVE") {
//       return setFilteredFeed(
//         feed.filter(f => f.type !== "RESTAURANT" || f.data.active)
//       );
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="delivery-page">

//       <OfferBanner />

//       {!loading && (
//         <>
//           <FoodDiscoveryRow title="Pure Veg Picks" items={vegItems} />
//           <FoodDiscoveryRow title="Non-Veg Favourites" items={nonVegItems} />
//           <FoodDiscoveryRow title="Snacks Near You" items={snacks} />
//           <FoodDiscoveryRow title="Desserts You’ll Love" items={desserts} />
//           <FoodDiscoveryRow title="Beverages & Drinks" items={beverages} />
//         </>
//       )}

//       <DeliveryFilters onFilter={handleFilter} />

//       <h2 className="delivery-title">Food Delivery in Lucknow</h2>

//       {error && <p className="error-text">{error}</p>}

//       <div className="mixed-grid">
//         {loading
//           ? Array.from({ length: 8 }).map((_, i) => (
//               <RestaurantSkeleton key={i} />
//             ))
//           : filteredFeed.map((item, index) =>
//               item.type === "RESTAURANT" ? (
//                 <RestaurantCard
//                   key={`res-${item.data.id}-${index}`}
//                   data={item.data}
//                 />
//               ) : (
//                 <FoodItemCard
//                   key={`food-${item.data.id}-${index}`}
//                   item={item.data}
//                 />
//               )
//             )}
//       </div>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import api from "../api/axios";

// import OfferBanner from "../Banner/OfferBanner";
// import FoodDiscoveryRow from "./FoodDiscoveryRow";
// import DeliveryFilters from "./DeliveryFilters";
// import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";
// import RestaurantCard from "../Restaurants/RestaurantCard";
// import { useNavigate } from "react-router-dom";

// export default function Delivery() {
//   const [searchParams] = useSearchParams();

//   // 🔍 SEARCH MODE
//   const searchQuery = searchParams.get("q"); // from navbar search
//   const selectedType = searchParams.get("type"); // veg/snacks/etc
//   const vegFilter = searchParams.get("veg");

//   const [loading, setLoading] = useState(true);
//   const [restaurants, setRestaurants] = useState([]);
//   const [filteredRestaurants, setFilteredRestaurants] = useState([]);
//   const [items, setItems] = useState([]);
//   const [error, setError] = useState(null);
//   const getUserLocation = () => {
//   const stored = localStorage.getItem("location");
//   if (!stored) return null;

//   try {
//     const parsed = JSON.parse(stored);
//     return parsed.city || parsed.location || null;
//   } catch {
//     return stored; // plain string case
//   }
// };

// const userLocation = getUserLocation();

//   useEffect(() => {
//     fetchAllData();
//   }, [searchQuery, selectedType, vegFilter]);
// const navigate = useNavigate();
//   // ================= FETCH ALL =================
//   const fetchAllData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       /* ================= SEARCH MODE ================= */
//       if (searchQuery) {
//         const res = await api.get("/api/search", {
//           params: {
//             q: searchQuery,
//             veg: vegFilter === null ? null : vegFilter === "true",
//             page: 0,
//             size: 20,
//           },
//         });

//         setItems(res.data);      // ✅ ONLY ITEMS
//         setRestaurants([]);      // ❌ NO RESTAURANTS
//         setFilteredRestaurants([]);
//         return;
//       }

//       /* ================= DISCOVERY ITEMS ================= */
//       let itemUrl = "/api/guest/restaurants/menu/snacks"; // default

//       if (selectedType === "veg") itemUrl = "/api/guest/restaurants/menu/veg";
//       if (selectedType === "nonveg") itemUrl = "/api/guest/restaurants/menu/non-veg";
//       if (selectedType === "snacks") itemUrl = "/api/guest/restaurants/menu/snacks";
//       if (selectedType === "desserts") itemUrl = "/api/guest/restaurants/menu/desserts";
//       if (selectedType === "beverages") itemUrl = "/api/guest/restaurants/menu/beverages";

//       const itemRes = await api.get(itemUrl);
//       const filteredItems =
//         vegFilter == null
//           ? itemRes.data
//           : itemRes.data.filter(i => String(i.veg) === vegFilter);

//       setItems(filteredItems);

//       /* ================= RESTAURANTS ================= */
//       const restaurantsRes = await api.get("/api/guest/restaurants");
//       setRestaurants(restaurantsRes.data);
//       setFilteredRestaurants(restaurantsRes.data);

//     } catch (err) {
//       console.error(err);
//       setError("Failed to load data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= FILTER HANDLER ================= */
//   const handleFilter = (type) => {
//     if (type === "CLEAR") {
//         navigate("/delivery");
//       return;
//     }

//     if (type === "VEG") {
//          navigate(`/delivery?type=${selectedType || "veg"}&veg=true`);
//       return;
//     }

//     if (type === "NON_VEG") {
//       navigate(`/delivery?type=${selectedType || "nonveg"}&veg=false`);
//       return;
//     }
//   };

//   // ================= UI =================
//   return (
//     <div className="page">

//       {/* 🔥 SHOW BANNER ONLY IF NOT SEARCH */}
//       {!searchQuery && <OfferBanner />}

//       {/* ================= ITEMS ================= */}
//       {!loading && items.length > 0 && (
//         <FoodDiscoveryRow
//           title={
//             searchQuery
//               ? `Search results for "${searchQuery}"`
//               : selectedType
//               ? `Popular ${selectedType}`
//               : "Popular dishes near you"
//           }
//           items={items}
//            onItemClick={(item) => navigate(`/search?q=${encodeURIComponent(item.name)}`)}
//         />
//       )}

//       {/* ================= FILTERS ================= */}
//       {/* {!searchQuery && <DeliveryFilters onFilter={handleFilter} />} */}

//       {/* ================= RESTAURANTS ================= */}
//       {!searchQuery && (
//         <>
//           <h2>Food Delivery Restaurants</h2>

//           {error && <p className="error-text">{error}</p>}

//           <div className="restaurant-grid">
//             {loading
//               ? Array.from({ length: 6 }).map((_, i) => (
//                   <RestaurantSkeleton key={i} />
//                 ))
//               : filteredRestaurants.map((res) => (
//                   <RestaurantCard key={res.id} data={res} />
//                 ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

import OfferBanner from "../Banner/OfferBanner";
import FoodDiscoveryRow from "./FoodDiscoveryRow";
import DeliveryFilters from "./DeliveryFilters";
import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";
import RestaurantCard from "../Restaurants/RestaurantCard";

export default function Delivery() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 🔍 SEARCH MODE
  const searchQuery = searchParams.get("q");
  const selectedType = searchParams.get("type");
  const vegFilter = searchParams.get("veg");

  const [loading, setLoading] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  // ✅ USER LOCATION STATE
  const [userLocation, setUserLocation] = useState(null);

  // ================= LOCATION FROM LOCAL STORAGE =================
  const extractCityFromAddress = (stored) => {
    if (!stored) return null;

    const address = stored.toLowerCase();

    if (address.includes("lucknow")) return "Lucknow";
    if (address.includes("banaras") || address.includes("varanasi")) return "Banaras";
    if (address.includes("delhi")) return "Delhi";

    return null;
  };

  // ✅ READ LOCATION ONCE (IMPORTANT)
  useEffect(() => {
    const storedAddress = localStorage.getItem("deliveryAddress"); // 🔥 FIX
    const city = extractCityFromAddress(storedAddress);
    setUserLocation(city);
  }, []);

  // ================= EFFECT =================
  useEffect(() => {
    fetchAllData();
  }, [searchQuery, selectedType, vegFilter, userLocation]);

  // ================= FETCH ALL =================
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      /* ================= SEARCH MODE ================= */
      if (searchQuery) {
        const res = await api.get("/api/search", {
          params: {
            q: searchQuery,
            veg: vegFilter === null ? null : vegFilter === "true",
            page: 0,
            size: 20,
          },
        });

        setItems(res.data);
        setRestaurants([]);
        setFilteredRestaurants([]);
        return;
      }

      /* ================= DISCOVERY ITEMS ================= */
      let itemUrl = "/api/guest/restaurants/menu/snacks";

      if (selectedType === "veg") itemUrl = "/api/guest/restaurants/menu/veg";
      if (selectedType === "nonveg") itemUrl = "/api/guest/restaurants/menu/non-veg";
      if (selectedType === "snacks") itemUrl = "/api/guest/restaurants/menu/snacks";
      if (selectedType === "desserts") itemUrl = "/api/guest/restaurants/menu/desserts";
      if (selectedType === "beverages") itemUrl = "/api/guest/restaurants/menu/beverages";

      const itemRes = await api.get(itemUrl);

      const filteredItems =
        vegFilter == null
          ? itemRes.data
          : itemRes.data.filter(i => String(i.veg) === vegFilter);

      setItems(filteredItems);

      /* ================= RESTAURANTS ================= */
      const restaurantsRes = await api.get("/api/guest/restaurants");

      let allRestaurants = restaurantsRes.data;

      // 🌆 FILTER BY USER CITY
      if (userLocation) {
        allRestaurants = allRestaurants.filter(
          res =>
            res.city &&
            res.city.toLowerCase().includes(userLocation.toLowerCase())
        );
      }

      setRestaurants(allRestaurants);
      setFilteredRestaurants(allRestaurants);

    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER HANDLER ================= */
  const handleFilter = (type) => {
    if (type === "CLEAR") {
      navigate("/delivery");
      return;
    }

    if (type === "VEG") {
      navigate(`/delivery?type=${selectedType || "veg"}&veg=true`);
      return;
    }

    if (type === "NON_VEG") {
      navigate(`/delivery?type=${selectedType || "nonveg"}&veg=false`);
      return;
    }
  };

  // ================= UI =================
  return (
    <div className="page">

      {/* 🔥 SHOW BANNER ONLY IF NOT SEARCH */}
      {!searchQuery && <OfferBanner />}

      {/* ================= ITEMS ================= */}
      {!loading && items.length > 0 && (
        <FoodDiscoveryRow
          title={
            searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedType
              ? `Popular ${selectedType}`
              : "Popular dishes near you"
          }
          items={items}
          onItemClick={(item) =>
            navigate(`/search?q=${encodeURIComponent(item.name)}`)
          }
        />
      )}

      {/* ================= RESTAURANTS ================= */}
      {!searchQuery && (
        <>
          {/* 🏷️ DYNAMIC HEADING */}
          <h2>
            {userLocation
              ? `Food Delivery Restaurants in ${userLocation}`
              : "Food Delivery Restaurants"}
          </h2>

          {error && <p className="error-text">{error}</p>}

          <div className="restaurant-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <RestaurantSkeleton key={i} />
                ))
              : filteredRestaurants.map((res) => (
                  <RestaurantCard key={res.id} data={res} />
                ))}
          </div>
        </>
      )}
    </div>
  );
}
