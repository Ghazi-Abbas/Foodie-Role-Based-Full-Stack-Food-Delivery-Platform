import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiUser from "./guest/api/apiUser";
import "./Checkout.css";

export default function Checkout() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryAddress, setDeliveryAddress] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    loadAddress();

    const handleAddressChange = () => {
      loadAddress();
    };

    window.addEventListener("address-change", handleAddressChange);
    window.addEventListener("storage", handleAddressChange);

    return () => {
      window.removeEventListener("address-change", handleAddressChange);
      window.removeEventListener("storage", handleAddressChange);
    };
  }, []);

  const loadAddress = () => {
    const stored = localStorage.getItem("deliveryAddress");
    setDeliveryAddress(stored || null);
  };

  const fetchProfile = async () => {
    try {
      const res = await apiUser.get("/users/me");
      setProfile(res.data);
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = async (item) => {
    await apiUser.post("/users/cart/add", {
      restaurantId: item.restaurantId,
      restaurantName: item.restaurantName,
      restaurantAddress: item.restaurantAddress,
      restaurantCity: item.restaurantCity,
      foodItemId: item.foodItemId,
      itemName: item.itemName,
      imageUrl: item.imageUrl,
      price: item.price,
      quantity: 1,
    });
    window.dispatchEvent(new Event("cart-change"));
    fetchProfile();
  };

  const decreaseQty = async (foodItemId) => {
    await apiUser.post(`/users/cart/decrease/${foodItemId}`);
    window.dispatchEvent(new Event("cart-change"));
    fetchProfile();
  };

  const removeItem = async (foodItemId) => {
    await apiUser.delete(`/users/cart/remove/${foodItemId}`);
    window.dispatchEvent(new Event("cart-change"));
    fetchProfile();
  };

  if (loading) return <p className="loading">Loading checkout...</p>;

  const cart = profile?.cart || [];
  const isCartEmpty = cart.length === 0;

  const itemTotal = cart.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const deliveryFee = isCartEmpty ? 0 : 40;
  const gst = isCartEmpty ? 0 : Math.round(itemTotal * 0.05);
  const toPay = itemTotal + deliveryFee + gst;

  return (
    <div className="checkout-page">

      {/* LEFT */}
      <div className="checkout-left">

        {/* DELIVERY ADDRESS */}
        <div className="step-card">
          <h3>Add a delivery address</h3>

          {deliveryAddress ? (
            <p className="address-text">
              📍 {deliveryAddress}
            </p>
          ) : (
            <p className="muted">
              No address selected. Use <strong>Live Location</strong> from navbar.
            </p>
          )}
        </div>

        <div className="step-card muted-card">
          <h3>Payment</h3>
        </div>
      </div>

      {/* RIGHT */}
      <div className="checkout-right">
        <div className="cart-card">

          {/* ================= CART ITEMS ================= */}
          {!isCartEmpty ? (
            cart.map(item => (
              <div key={item.foodItemId} className="cart-item">

                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  className="cart-img"
                />

                <div className="cart-info">
                  <span className="item-name">{item.itemName}</span>

                  <div className="restaurant-under-item">
                    <strong>{item.restaurantName}</strong>
                    <span>
                      {item.restaurantAddress}, {item.restaurantCity}
                    </span>
                  </div>

                  <div className="qty">
                    <button onClick={() => decreaseQty(item.foodItemId)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item)}>+</button>
                  </div>
                </div>

                <span className="price">
                  ₹{item.price * item.quantity}
                </span>

                <button
                  className="remove"
                  onClick={() => removeItem(item.foodItemId)}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            /* ✅ EMPTY CART STATE */
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#686b78",
              }}
            >
              <h3>Your cart is empty 🛒</h3>
              <p style={{ marginBottom: "16px" }}>
                Looks like you haven’t added anything yet
              </p>

              <button
                className="pay-btn"
                style={{ width: "auto", padding: "10px 24px" }}
                onClick={() => navigate("/delivery")}
              >
                Explore Food 🍽️
              </button>
            </div>
          )}

          {/* NOTE */}
          <input
            className="suggestion"
            placeholder="Any cooking instructions?"
            disabled={isCartEmpty}
          />

          {/* BILL */}
          <div className="bill">
            <Row label="Item Total" value={`₹${itemTotal}`} />
            <Row label="Delivery Fee" value={`₹${deliveryFee}`} />
            <Row label="GST & Charges" value={`₹${gst}`} />
            <hr />
            <Row label="TO PAY" value={`₹${toPay}`} bold />
          </div>

          {/* PAY BUTTON */}
          <button
            className="pay-btn"
            disabled={isCartEmpty}
            onClick={() =>
              navigate("/payment", {
                state: { amountInINR: toPay }
              })
            }
          >
            {isCartEmpty ? "Add items to pay" : `Pay ₹${toPay}`}
          </button>

        </div>

        <div className="policy">
          <h4>Review your order</h4>
          <p>Orders once placed cannot be cancelled.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`bill-row ${bold ? "bold" : ""}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiUser from "./guest/api/apiUser";
// import "./Checkout.css";

// export default function Checkout() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deliveryAddress, setDeliveryAddress] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//     loadAddress();

//     const handleAddressChange = () => {
//       loadAddress();
//     };

//     window.addEventListener("address-change", handleAddressChange);
//     window.addEventListener("storage", handleAddressChange);

//     return () => {
//       window.removeEventListener("address-change", handleAddressChange);
//       window.removeEventListener("storage", handleAddressChange);
//     };
//   }, []);

//   const loadAddress = () => {
//     const stored = localStorage.getItem("deliveryAddress");
//     setDeliveryAddress(stored || null);
//   };

//   const fetchProfile = async () => {
//     try {
//       const res = await apiUser.get("/users/me");
//       setProfile(res.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const increaseQty = async (item) => {
//     await apiUser.post("/users/cart/add", {
//       restaurantId: item.restaurantId,
//       restaurantName: item.restaurantName,
//       restaurantAddress: item.restaurantAddress,
//       restaurantCity: item.restaurantCity,
//       foodItemId: item.foodItemId,
//       itemName: item.itemName,
//       imageUrl: item.imageUrl,
//       price: item.price,
//       quantity: 1,
//     });
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   const decreaseQty = async (foodItemId) => {
//     await apiUser.post(`/users/cart/decrease/${foodItemId}`);
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   const removeItem = async (foodItemId) => {
//     await apiUser.delete(`/users/cart/remove/${foodItemId}`);
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   if (loading) return <p className="loading">Loading checkout...</p>;
//   if (!profile || profile.cart.length === 0)
//     return <p className="empty-cart">Your cart is empty</p>;

//   const itemTotal = profile.cart.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   const deliveryFee = 40;
//   const gst = Math.round(itemTotal * 0.05);
//   const toPay = itemTotal + deliveryFee + gst;

//   return (
//     <div className="checkout-page">

//       {/* LEFT */}
//       <div className="checkout-left">

//         {/* ✅ DELIVERY ADDRESS */}
//         <div className="step-card">
//           <h3>Add a delivery address</h3>

//           {deliveryAddress ? (
//             <p className="address-text">
//               📍 {deliveryAddress}
//             </p>
//           ) : (
//             <p className="muted">
//               No address selected. Use <strong>Live Location</strong> from navbar.
//             </p>
//           )}
//         </div>

//         <div className="step-card muted-card">
//           <h3>Payment</h3>
//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="checkout-right">
//         <div className="cart-card">

//           {/* ITEMS */}
//           {profile.cart.map(item => (
//             <div key={item.foodItemId} className="cart-item">

//               <img
//                 src={item.imageUrl}
//                 alt={item.itemName}
//                 className="cart-img"
//               />

//               <div className="cart-info">
//                 <span className="item-name">{item.itemName}</span>

//                 <div className="restaurant-under-item">
//                   <strong>{item.restaurantName}</strong>
//                   <span>
//                     {item.restaurantAddress}, {item.restaurantCity}
//                   </span>
//                 </div>

//                 <div className="qty">
//                   <button onClick={() => decreaseQty(item.foodItemId)}>−</button>
//                   <span>{item.quantity}</span>
//                   <button onClick={() => increaseQty(item)}>+</button>
//                 </div>
//               </div>

//               <span className="price">
//                 ₹{item.price * item.quantity}
//               </span>

//               <button
//                 className="remove"
//                 onClick={() => removeItem(item.foodItemId)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}

//           <input
//             className="suggestion"
//             placeholder="Any cooking instructions?"
//           />

//           <div className="bill">
//             <Row label="Item Total" value={`₹${itemTotal}`} />
//             <Row label="Delivery Fee" value={`₹${deliveryFee}`} />
//             <Row label="GST & Charges" value={`₹${gst}`} />
//             <hr />
//             <Row label="TO PAY" value={`₹${toPay}`} bold />
//           </div>

//           <button
//             className="pay-btn"
//             onClick={() =>
//               navigate("/payment", {
//                 state: { amountInINR: toPay }
//               })
//             }
//           >
//             Pay ₹{toPay}
//           </button>

//         </div>

//         <div className="policy">
//           <h4>Review your order</h4>
//           <p>Orders once placed cannot be cancelled.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value, bold }) {
//   return (
//     <div className={`bill-row ${bold ? "bold" : ""}`}>
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import apiUser from "./guest/api/apiUser";
// import "./Checkout.css";

// export default function Checkout() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const res = await apiUser.get("/users/me");
//       setProfile(res.data);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const increaseQty = async (item) => {
//     await apiUser.post("/users/cart/add", {
//       restaurantId: item.restaurantId,
//       restaurantName: item.restaurantName,
//       restaurantAddress: item.restaurantAddress,
//       restaurantCity: item.restaurantCity,

//       foodItemId: item.foodItemId,
//       itemName: item.itemName,
//       imageUrl: item.imageUrl,
//       price: item.price,
//       quantity: 1,
//     });
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   const decreaseQty = async (foodItemId) => {
//     await apiUser.post(`/users/cart/decrease/${foodItemId}`);
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   const removeItem = async (foodItemId) => {
//     await apiUser.delete(`/users/cart/remove/${foodItemId}`);
//     window.dispatchEvent(new Event("cart-change"));
//     fetchProfile();
//   };

//   if (loading) return <p className="loading">Loading checkout...</p>;
//   if (!profile || profile.cart.length === 0)
//     return <p className="empty-cart">Your cart is empty</p>;

//   const itemTotal = profile.cart.reduce(
//     (sum, i) => sum + i.price * i.quantity,
//     0
//   );

//   const deliveryFee = 40;
//   const gst = Math.round(itemTotal * 0.05);
//   const toPay = itemTotal + deliveryFee + gst;

//   return (
//     <div className="checkout-page">

//       {/* LEFT */}
//       <div className="checkout-left">
//         <div className="step-card">
//           <h3>Add a delivery address</h3>
//           <p className="muted">Delivering to saved address</p>
//         </div>

//         <div className="step-card muted-card">
//           <h3>Payment</h3>
//         </div>
//       </div>

//       {/* RIGHT */}
//       <div className="checkout-right">
//         <div className="cart-card">

//           {/* ITEMS */}
//           {profile.cart.map(item => (
//             <div key={item.foodItemId} className="cart-item">

//               {/* IMAGE */}
//               <img
//                 src={item.imageUrl}
//                 alt={item.itemName}
//                 className="cart-img"
//               />

//               {/* INFO */}
//               <div className="cart-info">
//                 <span className="item-name">{item.itemName}</span>

//                 {/* RESTAURANT INFO */}
//                 <div className="restaurant-under-item">
//                   <strong>{item.restaurantName}</strong>
//                   <span>
//                     {item.restaurantAddress}, {item.restaurantCity}
//                   </span>
//                 </div>

//                 <div className="qty">
//                   <button onClick={() => decreaseQty(item.foodItemId)}>−</button>
//                   <span>{item.quantity}</span>
//                   <button onClick={() => increaseQty(item)}>+</button>
//                 </div>
//               </div>

//               {/* PRICE */}
//               <span className="price">
//                 ₹{item.price * item.quantity}
//               </span>

//               {/* REMOVE */}
//               <button
//                 className="remove"
//                 onClick={() => removeItem(item.foodItemId)}
//               >
//                 ✕
//               </button>
//             </div>
//           ))}

//           {/* NOTE */}
//           <input
//             className="suggestion"
//             placeholder="Any cooking instructions?"
//           />

//           {/* BILL */}
//           <div className="bill">
//             <Row label="Item Total" value={`₹${itemTotal}`} />
//             <Row label="Delivery Fee" value={`₹${deliveryFee}`} />
//             <Row label="GST & Charges" value={`₹${gst}`} />
//             <hr />
//             <Row label="TO PAY" value={`₹${toPay}`} bold />
//           </div>

//           {/* 🔥 PAY BUTTON CONNECTED */}
//           <button
//             className="pay-btn"
//             onClick={() =>
//               navigate("/payment", {
//                 state: {
//                   amountInINR: toPay
//                 }
//               })
//             }
//           >
//             Pay ₹{toPay}
//           </button>

//         </div>

//         <div className="policy">
//           <h4>Review your order</h4>
//           <p>Orders once placed cannot be cancelled.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Row({ label, value, bold }) {
//   return (
//     <div className={`bill-row ${bold ? "bold" : ""}`}>
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }
