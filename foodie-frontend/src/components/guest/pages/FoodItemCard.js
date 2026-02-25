import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FoodItemCard.css";

export default function FoodItemCard({ item }) {
  const navigate = useNavigate();

  const openRestaurant = () => {
    navigate(`/restaurant/${item.restaurantId}`);
  };

  const handleAdd = (e) => {
    e.stopPropagation(); // prevent card click
    console.log("ADD TO CART", item);
  };

  return (
    <div className="food-item-card" onClick={openRestaurant}>
      
      {/* IMAGE */}
      <div className="food-img-wrapper">
        <img
          src={item.imageUrl || "/images/food-placeholder.png"}
          alt={item.name}
        />

        {/* Rating overlay */}
        <span className="food-rating">
          <FaStar /> {item.rating || "4.2"}
        </span>

        {/* Veg / Non-veg dot */}
        {item.veg !== undefined && (
          <span
            className={`food-type ${item.veg ? "veg" : "non-veg"}`}
          />
        )}
      </div>

      {/* INFO */}
      <div className="food-info">
        <h4 className="food-name">{item.name}</h4>
        <p className="food-restaurant">{item.restaurantName}</p>

        <div className="food-bottom">
          <span className="food-price">₹{item.price}</span>

          <button className="food-add-btn" onClick={handleAdd}>
            ADD
          </button>
        </div>
      </div>
    </div>
  );
}
