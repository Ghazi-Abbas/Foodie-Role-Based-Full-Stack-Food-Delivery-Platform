// context/RestaurantContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const RestaurantContext = createContext();

export const useRestaurant = () => useContext(RestaurantContext);

export function RestaurantProvider({ children }) {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;

    axios
      .get(`http://localhost:9092/restaurant-api/owner/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setRestaurant(res.data?.[0] || null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <RestaurantContext.Provider value={{ restaurant, loading }}>
      {children}
    </RestaurantContext.Provider>
  );
}
