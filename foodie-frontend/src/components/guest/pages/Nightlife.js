import { useEffect, useRef, useState } from "react";
import api from "../api/axios";

import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";
import RestaurantCard from "../Restaurants/RestaurantCard";

import "./Nightlife.css";

export default function Nightlife() {
  const [loading, setLoading] = useState(true);
  const [nightRestaurants, setNightRestaurants] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [error, setError] = useState(null);

  // ✅ REF FOR DRINK SLIDER
  const drinkRowRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Restaurants
      const res = await api.get("/api/guest/restaurants");
      const filtered = res.data.filter(isNightlifeRestaurant);
      setNightRestaurants(filtered);

      // Beverages
      const bev = await api.get("/api/guest/restaurants/menu/beverages");
      setBeverages(bev.data || []);
    } catch (e) {
      setError("Failed to load nightlife data");
    } finally {
      setLoading(false);
    }
  };

  // ================= OPEN AFTER 6 PM =================
  const isNightlifeRestaurant = (r) => {
    if (!r.openingTime || !r.closingTime) return false;

    const [oH, oM] = r.openingTime.split(":").map(Number);
    const [cH, cM] = r.closingTime.split(":").map(Number);

    const openMinutes = oH * 60 + oM;
    const closeMinutes = cH * 60 + cM;
    const sixPM = 18 * 60;

    return openMinutes <= sixPM && closeMinutes >= sixPM;
  };

  // ================= DRINK SLIDER CONTROLS =================
  const scrollDrinksLeft = () => {
  const row = drinkRowRef.current;
  if (!row) return;

  // If already at start → jump to end
  if (row.scrollLeft <= 0) {
    row.scrollTo({
      left: row.scrollWidth,
      behavior: "smooth",
    });
  } else {
    row.scrollBy({
      left: -320,
      behavior: "smooth",
    });
  }
};

const scrollDrinksRight = () => {
  const row = drinkRowRef.current;
  if (!row) return;

  // If at end → jump to start
  if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 5) {
    row.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  } else {
    row.scrollBy({
      left: 320,
      behavior: "smooth",
    });
  }
};


  return (
    <div className="nightlife-page">
      {/* ================= HERO ================= */}
      <div className="nightlife-hero-bg">
        <div className="nightlife-hero page">
          <div className="nightlife-hero-overlay">
            <h1>Nightlife in Lucknow</h1>
            <p>
              Bars, lounges and late-evening dining spots open after sunset
            </p>
          </div>
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="page">
        {/* ================= DRINKS ================= */}
        {beverages.length > 0 && (
          <section className="nightlife-section">
            <h2>Popular drinks for the evening</h2>

            <div className="drink-slider-wrapper">
              {/* LEFT BUTTON */}
              <button
                className="drink-scroll-btn left"
                onClick={scrollDrinksLeft}
              >
                ‹
              </button>

              {/* DRINK ROW */}
              <div className="night-drink-row" ref={drinkRowRef}>
                {beverages.slice(0, 12).map((b, i) => (
                  <div className="night-drink-card" key={i}>
                    <img src={b.imageUrl} alt={b.name} />
                    <div className="drink-overlay">
                      <span className="drink-tag">Bar special</span>
                      <h4>{b.name}</h4>
                      <p>₹{b.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT BUTTON */}
              <button
                className="drink-scroll-btn right"
                onClick={scrollDrinksRight}
              >
                ›
              </button>
            </div>
          </section>
        )}

        {/* ================= ERROR ================= */}
        {error && <p className="error-text">{error}</p>}

        {/* ================= RESTAURANTS ================= */}
        <section className="nightlife-section">
          <h2>Open after 6 PM</h2>

          <div className="restaurant-grid nightlife-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <RestaurantSkeleton key={i} />
              ))
            ) : nightRestaurants.length === 0 ? (
              <p className="night-empty">
                No restaurants currently open late
              </p>
            ) : (
              nightRestaurants.map((res) => (
                <div key={res.id} className="night-card-wrapper">
                  <span className="night-badge">Open late</span>
                  <RestaurantCard data={res} />
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
