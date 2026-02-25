import { useEffect, useState } from "react";
import api from "../api/axios";

import CollectionsSection from "../Collections/CollectionsSection";
import OfferBanner from "../Banner/OfferBanner";
import RestaurantCard from "../Restaurants/RestaurantCard";
import RestaurantSkeleton from "../Skeleton/RestaurantSkeleton";

import "./PageLayout.css";
import "../global.css";

export default function DiningOut() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);

      // ✅ CORRECT API FOR HOME PAGE
      const response = await api.get("/api/guest/restaurants");

      setRestaurants(response.data);
    } catch (err) {
      console.error("Error fetching restaurants", err);
      setError("Failed to load restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="zomato-shell">
        <CollectionsSection />
        <OfferBanner />

        <h2>Restaurants in Lucknow</h2>

        {error && <p className="error-text">{error}</p>}

        <div className="restaurant-grid">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <RestaurantSkeleton key={i} />
              ))
            : restaurants.map((res) => (
                <RestaurantCard key={res.id} data={res} />
              ))}
        </div>
      </div>
    </div>
  );
}
