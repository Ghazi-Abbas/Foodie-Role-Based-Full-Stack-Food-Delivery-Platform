import { useNavigate } from "react-router-dom";

export default function ChatDataCard({ item, onNavigateBack, closeChat }) {
  const navigate = useNavigate();
  if (!item) return null;

  const isOrder = !!item.orderStatus || !!item.createdAt;
  const isCartItem = item.quantity !== undefined;

  const handleClick = () => {
    if (isOrder) {
      // 📦 ORDER → PROFILE ORDERS TAB
      navigate("/profile?tab=orders");
    } else if (isCartItem) {
      // 🛒 CART → CHECKOUT
      navigate("/checkout");
    } else {
      // 🍽 FOOD → DELIVERY PAGE
      navigate("/delivery");
    }

    // 🔥 KEEP CHAT FLOW
    onNavigateBack?.();

    // 🔥 ACTUALLY CLOSE CHAT WINDOW
    closeChat?.();
  };

  /* 🔥 SUPPORT FOOD + CART + ORDER STRUCTURES */
  const imageUrl =
    item.imageUrl ||
    item?.items?.[0]?.imageUrl ||
    "https://via.placeholder.com/70x70.png?text=Food";

  const titleText =
    item.name ||
    item.restaurantName ||
    item?.items?.[0]?.itemName ||
    "Food Item";

  const priceValue =
    item.price ??
    item.totalAmount ??
    item?.items?.[0]?.price ??
    "--";

  const isVeg =
    item.veg !== undefined ? item.veg : false;

  const orderStatus = item.orderStatus;
  const createdAt = item.createdAt;

  return (
    <div style={card} onClick={handleClick}>
      {/* IMAGE */}
      <img
        src={imageUrl}
        alt={titleText}
        style={image}
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/70x70.png?text=Food";
        }}
      />

      {/* CONTENT */}
      <div style={content}>
        <h3 style={title}>{titleText}</h3>

        <p style={price}>₹ {priceValue}</p>

        <p style={time}>⏱ 30 min delivery</p>

        {/* CART META */}
        {isCartItem && (
          <p style={meta}>🛒 Quantity: {item.quantity}</p>
        )}

        {/* ORDER META */}
        {orderStatus && (
          <p style={meta}>📦 Status: {orderStatus}</p>
        )}

        {createdAt && (
          <p style={meta}>
            🕒 {new Date(createdAt).toLocaleString()}
          </p>
        )}

        {/* VEG / NON-VEG */}
        {item.veg !== undefined && (
          <span
            style={{
              ...badge,
              background: isVeg ? "#1db954" : "#e63946"
            }}
          >
            {isVeg ? "🥬 Veg" : "🍗 Non-Veg"}
          </span>
        )}
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const card = {
  display: "flex",
  gap: 12,
  padding: 12,
  borderRadius: 14,
  background: "rgba(255,255,255,.08)",
  border: "1px solid rgba(255,255,255,.15)",
  cursor: "pointer",
  alignItems: "center"
};

const image = {
  width: 70,
  height: 70,
  borderRadius: 10,
  objectFit: "cover",
  flexShrink: 0,
  background: "#222"
};

const content = {
  flex: 1
};

const title = {
  margin: 0,
  fontSize: 15,
  fontWeight: 700,
  color: "white"
};

const price = {
  margin: "4px 0",
  fontWeight: 600,
  fontSize: 14,
  color: "#f1f1f1"
};

const time = {
  fontSize: 12,
  color: "#bbb",
  marginBottom: 4
};

const meta = {
  fontSize: 12,
  color: "#aaa"
};

const badge = {
  display: "inline-block",
  marginTop: 6,
  padding: "2px 8px",
  borderRadius: 20,
  fontSize: 12,
  fontWeight: 600,
  color: "white"
};
