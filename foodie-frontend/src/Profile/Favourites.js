import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const USER_API = "http://localhost:9091/users";

const Favourites = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${USER_API}/favourites`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setItems(res.data || []);
    } catch (e) {
      console.error("Failed to load favourites", e);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (foodItemId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${USER_API}/favourites/remove/${foodItemId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(prev =>
        prev.filter(item => item.foodItemId !== foodItemId)
      );
    } catch (e) {
      console.error("Failed to remove favourite", e);
    }
  };

  if (loading) {
    return (
      <p style={styles.loading}>
        Loading favourites...
      </p>
    );
  }

  if (!items.length) {
    return (
      <div style={styles.emptyPanel}>
        <h2>No Favourites ❤️</h2>
        <p>You haven't added any favourites yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Your Favourites</h2>

      <div style={styles.grid}>
        {items.map(item => (
          <div key={item.foodItemId} style={styles.card}>

            <div
              style={styles.info}
              onClick={() =>
                navigate(
                  `/restaurant/${item.restaurantId}/item/${item.foodItemId}`
                )
              }
            >
              <h4 style={styles.name}>{item.itemName}</h4>
              <p style={styles.price}>₹{item.price}</p>
            </div>

            <button
              style={styles.removeBtn}
              onClick={() => removeFavourite(item.foodItemId)}
              title="Remove favourite"
            >
              ✕
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;

/* ================= STYLES ================= */

const styles = {
  page: {
    padding: "20px",
  },
  heading: {
    marginBottom: "16px",
  },
  loading: {
    padding: "20px",
    textAlign: "center",
  },
  emptyPanel: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  info: {
    cursor: "pointer",
  },
  name: {
    margin: 0,
    fontSize: "16px",
  },
  price: {
    margin: "6px 0 0",
    color: "#555",
  },
  removeBtn: {
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
    color: "#e74c3c",
  },
};
