import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { SiOpenai } from "react-icons/si";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../api/axios";
import apiUser from "../api/apiUser";

import "./ItemDetails.css";

export default function ItemDetails() {
  const { restaurantId, itemId } = useParams();
  const navigate = useNavigate();

  /* ================= AUTH ================= */
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;

  /* ================= STATE ================= */
  const [data, setData] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // AI
  const [aiInfo, setAiInfo] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Review
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [canReview, setCanReview] = useState(false); // ✅ eligibility

  // Favourite
  const [isFavourite, setIsFavourite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  /* ================= INIT ================= */
  useEffect(() => {
    fetchItemDetails();
    fetchRestaurantDetails();
    if (isLoggedIn) {
      checkFavourite();
      checkOrderEligibility();
    }
    // eslint-disable-next-line
  }, [itemId]);

  /* ================= ITEM ================= */
  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}`
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurantDetails = async () => {
    try {
      const res = await api.get(`/api/guest/restaurants/${restaurantId}`);
      setRestaurant(res.data);
    } catch {
      toast.error("Failed to load restaurant");
    }
  };

  const openSignupModal = () => {
    window.dispatchEvent(new Event("open-auth"));
  };

  /* ================= CART ================= */
  const addToCart = async () => {
    if (!isLoggedIn) return openSignupModal();
    if (!data || !restaurant) return;

    try {
      await apiUser.post("/users/cart/add", {
        restaurantId,
        restaurantName: restaurant.name,
        restaurantAddress: restaurant.address,
        restaurantCity: restaurant.city,
        foodItemId: itemId,
        itemName: data.item.itemName,
        imageUrl: data.item.imageUrl,
        price: data.item.price,
        quantity,
      });

      window.dispatchEvent(new Event("cart-change"));
      toast.success("Added to cart 🛒");
    } catch {
      toast.error("Failed to add item to cart");
    }
  };

  /* ================= AI ================= */
  const fetchAiInfo = async () => {
    try {
      setAiLoading(true);
      const res = await api.get(
        `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}/ai-info`
      );
      setAiInfo(res.data.aiInfo);
    } finally {
      setAiLoading(false);
    }
  };

  /* ================= FAV ================= */
  const checkFavourite = async () => {
    try {
      const res = await apiUser.get(`/users/favourites/check/${itemId}`);
      setIsFavourite(res.data === true);
    } catch {
      setIsFavourite(false);
    }
  };

  const toggleFavourite = async () => {
    if (!isLoggedIn) return openSignupModal();

    setFavLoading(true);
    try {
      if (isFavourite) {
        await apiUser.delete(`/users/favourites/remove/${itemId}`);
        setIsFavourite(false);
        toast.info("Removed from favourites");
      } else {
        await apiUser.post("/users/favourites/add", {
          restaurantId,
          foodItemId: itemId,
          itemName: data.item.itemName,
          price: data.item.price,
        });
        setIsFavourite(true);
        toast.success("Added to favourites ♥");
      }
    } finally {
      setFavLoading(false);
    }
  };

  /* ================= REVIEW ================= */
  const checkOrderEligibility = async () => {
    try {
      const res = await apiUser.get(`/users/orders/has-ordered/${itemId}`);
      setCanReview(res.data === true); // ✅ ONLY delivered orders
    } catch {
      setCanReview(false);
    }
  };

  const submitReview = async () => {
    if (!canReview) {
      toast.error("You can review only after delivery");
      return;
    }

    if (!rating) {
      toast.error("Please select rating");
      return;
    }

    try {
      await apiUser.post("/users/reviews/add", {
        foodItemId: itemId,
        rating,
        review: reviewText,
      });

      toast.success("Review submitted ⭐");
      setRating(0);
      setReviewText("");
      fetchItemDetails();
    } catch {
      toast.error("Failed to submit review");
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (!data) return <p>Item not found</p>;

  const { item, averageRating, totalRatings, reviews } = data;

  return (
    <div className="item-page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="image-wrapper">
        <img className="item-image" src={item.imageUrl} alt={item.itemName} />
        <button
          className={`fav-btn ${isFavourite ? "active" : ""}`}
          onClick={toggleFavourite}
          disabled={favLoading}
        >
          {isFavourite ? "♥" : "♡"}
        </button>
      </div>

      <h1>{item.itemName}</h1>

      <p className="restaurant-info">
        <strong>{restaurant?.name}</strong> • {restaurant?.address}, {restaurant?.city}
      </p>

      <div className="price-row">
        <span className="price">₹{item.price}</span>
        <button className="add-btn" onClick={addToCart}>Add to cart</button>
      </div>

      <p className="desc">{item.description}</p>

      {/* ================= REVIEW FORM ================= */}
      {isLoggedIn && (
        <div className={`review-form ${!canReview ? "disabled" : ""}`}>
          <h3>Rate & Review</h3>

          {!canReview && (
            <p style={{ color: "#888", fontSize: "13px" }}>
              You can review this item only after it is delivered
            </p>
          )}

          <div className="rating-input">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                onClick={() => canReview && setRating(n)}
                style={{
                  color: n <= rating ? "#f39c12" : "#ccc",
                  cursor: canReview ? "pointer" : "not-allowed",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Write your review (optional)"
            value={reviewText}
            disabled={!canReview}
            onChange={e => setReviewText(e.target.value)}
          />

          <button disabled={!canReview} onClick={submitReview}>
            Submit Review
          </button>
        </div>
      )}

      {/* ================= AI CARD ================= */}
      <div className="ai-card">
        <div className="ai-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <SiOpenai size={22} color="#10a37f" />
            <span>AI Food Insights</span>
          </div>

          {!aiInfo && (
            <button onClick={fetchAiInfo}>
              {aiLoading ? "Loading..." : "View"}
            </button>
          )}
        </div>

        {aiInfo && (
          <div className="ai-text">
            <ReactMarkdown>{aiInfo}</ReactMarkdown>
            <div style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
              <SiOpenai size={14} /> Response generated by ChatGPT
            </div>
          </div>
        )}
      </div>

      {/* ================= REVIEWS ================= */}
      <div className="reviews">
        <h3>Customer Reviews</h3>
        {reviews.length === 0 && <p>No reviews yet</p>}
        {reviews.map((r, i) => (
          <div key={i} className="review-card">
            <strong>{r.userName}</strong>
            <span>{r.rating} ★</span>
            <p>{r.review}</p>
          </div>
        ))}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}


// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import { SiOpenai } from "react-icons/si";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// import api from "../api/axios";
// import apiUser from "../api/apiUser";

// import "./ItemDetails.css";

// export default function ItemDetails() {
//   const { restaurantId, itemId } = useParams();
//   const navigate = useNavigate();

//   /* ================= AUTH ================= */
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const user = isLoggedIn ? JSON.parse(localStorage.getItem("user")) : null;

//   /* ================= STATE ================= */
//   const [data, setData] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   // AI
//   const [aiInfo, setAiInfo] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   // Review
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");
//   const [canReview, setCanReview] = useState(false);

//   // Favourite
//   const [isFavourite, setIsFavourite] = useState(false);
//   const [favLoading, setFavLoading] = useState(false);

//   /* ================= INIT ================= */
//   useEffect(() => {
//     fetchItemDetails();
//     fetchRestaurantDetails();
//     if (isLoggedIn) {
//       checkFavourite();
//       checkOrderEligibility();
//     }
//     // eslint-disable-next-line
//   }, [itemId]);

//   /* ================= ITEM ================= */
//   const fetchItemDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}`
//       );
//       setData(res.data);
//     } catch (e) {
//       console.error(e);
//       toast.error("Failed to load item");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRestaurantDetails = async () => {
//     try {
//       const res = await api.get(`/api/guest/restaurants/${restaurantId}`);
//       setRestaurant(res.data);
//     } catch {
//       toast.error("Failed to load restaurant");
//     }
//   };

//   const openSignupModal = () => {
//     window.dispatchEvent(new Event("open-auth"));
//   };

//   /* ================= CART ================= */
//   const addToCart = async () => {
//     if (!isLoggedIn) return openSignupModal();
//     if (!data || !restaurant) return;

//     try {
//       await apiUser.post("/users/cart/add", {
//         restaurantId,
//         restaurantName: restaurant.name,
//         restaurantAddress: restaurant.address,
//         restaurantCity: restaurant.city,
//         foodItemId: itemId,
//         itemName: data.item.itemName,
//         imageUrl: data.item.imageUrl,
//         price: data.item.price,
//         quantity,
//       });

//       window.dispatchEvent(new Event("cart-change"));
//       toast.success("Added to cart 🛒");
//     } catch {
//       toast.error("Failed to add item to cart");
//     }
//   };

//   /* ================= AI ================= */
//   const fetchAiInfo = async () => {
//     try {
//       setAiLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}/ai-info`
//       );
//       setAiInfo(res.data.aiInfo);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   /* ================= FAV ================= */
//   const checkFavourite = async () => {
//     try {
//       const res = await apiUser.get(`/users/favourites/check/${itemId}`);
//       setIsFavourite(res.data === true);
//     } catch {
//       setIsFavourite(false);
//     }
//   };

//   const toggleFavourite = async () => {
//     if (!isLoggedIn) return openSignupModal();

//     setFavLoading(true);
//     try {
//       if (isFavourite) {
//         await apiUser.delete(`/users/favourites/remove/${itemId}`);
//         setIsFavourite(false);
//         toast.info("Removed from favourites");
//       } else {
//         await apiUser.post("/users/favourites/add", {
//           restaurantId,
//           foodItemId: itemId,
//           itemName: data.item.itemName,
//           price: data.item.price,
//         });
//         setIsFavourite(true);
//         toast.success("Added to favourites ♥");
//       }
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   /* ================= REVIEW ================= */
//   const checkOrderEligibility = async () => {
//     try {
//       const res = await apiUser.get(`/users/orders/has-ordered/${itemId}`);
//       setCanReview(res.data === true);
//     } catch {
//       setCanReview(false);
//     }
//   };

//   const submitReview = async () => {
//     if (!rating) {
//       toast.error("Please select rating");
//       return;
//     }

//     try {
//       await apiUser.post("/users/reviews/add", {
//         foodItemId: itemId,
//         rating,
//         review: reviewText,
//       });

//       toast.success("Review submitted ⭐");
//       setRating(0);
//       setReviewText("");
//       fetchItemDetails();
//     } catch {
//       toast.error("Failed to submit review");
//     }
//   };

//   /* ================= RATING COLOR ================= */
//   const getRatingColor = (rating) => {
//     if (rating >= 4) return "#2ecc71";
//     if (rating >= 2.5) return "#f39c12";
//     return "#e74c3c";
//   };

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p>Item not found</p>;

//   const { item, averageRating, totalRatings, reviews } = data;

//   return (
//     <div className="item-page">
//       <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

//       <div className="image-wrapper">
//         <img className="item-image" src={item.imageUrl} alt={item.itemName} />
//         <button
//           className={`fav-btn ${isFavourite ? "active" : ""}`}
//           onClick={toggleFavourite}
//           disabled={favLoading}
//         >
//           {isFavourite ? "♥" : "♡"}
//         </button>
//       </div>

//       <h1>{item.itemName}</h1>

//       <p className="restaurant-info">
//         <strong>{restaurant?.name}</strong> • {restaurant?.address}, {restaurant?.city}
//       </p>

//       <div className="price-row">
//         <span className="price">₹{item.price}</span>
//         <button className="add-btn" onClick={addToCart}>Add to cart</button>
//       </div>

//       <p className="desc">{item.description}</p>

//       {/* ================= REVIEW FORM ================= */}
//       {isLoggedIn && canReview && (
//         <div className="review-form">
//           <h3>Rate & Review</h3>

//           <div className="rating-input">
//             {[1,2,3,4,5].map(n => (
//               <span
//                 key={n}
//                 onClick={() => setRating(n)}
//                 style={{ color: n <= rating ? "#f39c12" : "#ccc", cursor: "pointer" }}
//               >
//                 ★
//               </span>
//             ))}
//           </div>

//           <textarea
//             placeholder="Write your review (optional)"
//             value={reviewText}
//             onChange={e => setReviewText(e.target.value)}
//           />

//           <button onClick={submitReview}>Submit Review</button>
//         </div>
//       )}
//         {/* ================= AI CARD ================= */}
//        <div className="ai-card">
//          <div className="ai-header">
//            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//              <SiOpenai size={22} color="#10a37f" />
//              <span>AI Food Insights</span>
//            </div>

//            {!aiInfo && (
//              <button onClick={fetchAiInfo}>
//                {aiLoading ? "Loading..." : "View"}
//              </button>
//            )}
//          </div>

//          {aiInfo && (
//            <div className="ai-text">
//              <ReactMarkdown>{aiInfo}</ReactMarkdown>

//              <div
//                style={{
//                  marginTop: "10px",
//                  fontSize: "12px",
//                  color: "#888",
//                  display: "flex",
//                  alignItems: "center",
//                gap: "6px"
//               }}
//             >
//               <SiOpenai size={14} />
//               <span>Response generated by ChatGPT</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= REVIEWS ================= */}
//       <div className="reviews">
//         <h3>Customer Reviews</h3>
//         {reviews.length === 0 && <p>No reviews yet</p>}
//         {reviews.map((r, i) => (
//           <div key={i} className="review-card">
//             <strong>{r.userName}</strong>
//             <span>{r.rating} ★</span>
//             <p>{r.review}</p>
//           </div>
//         ))}
//       </div>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </div>
//   );
// }





// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";
// import { SiOpenai } from "react-icons/si";   // ✅ ChatGPT icon

// import api from "../api/axios";        // 9092 → restaurant service
// import apiUser from "../api/apiUser";  // 9091 → user service

// import "./ItemDetails.css";

// export default function ItemDetails() {
//   const { restaurantId, itemId } = useParams();
//   const navigate = useNavigate();

//   /* ================= AUTH ================= */

//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const user = isLoggedIn
//     ? JSON.parse(localStorage.getItem("user"))
//     : null;

//   /* ================= STATE ================= */

//   const [data, setData] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   // AI
//   const [aiInfo, setAiInfo] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   // Review
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");

//   // Favourite
//   const [isFavourite, setIsFavourite] = useState(false);
//   const [favLoading, setFavLoading] = useState(false);

//   /* ================= INIT ================= */

//   useEffect(() => {
//     fetchItemDetails();
//     fetchRestaurantDetails();
//     if (isLoggedIn) checkFavourite();
//     // eslint-disable-next-line
//   }, [itemId]);

//   /* ================= ITEM ================= */

//   const fetchItemDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}`
//       );
//       setData(res.data);
//     } catch (e) {
//       console.error("Item fetch failed", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRestaurantDetails = async () => {
//     try {
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}`
//       );
//       setRestaurant(res.data);
//     } catch (e) {
//       console.error("Restaurant fetch failed", e);
//     }
//   };

//   const openSignupModal = () => {
//     window.dispatchEvent(new Event("open-auth"));
//   };

//   /* ================= CART ================= */

//   const addToCart = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     if (!data || !restaurant) return;

//     try {
//       await apiUser.post("/users/cart/add", {
//         restaurantId,
//         restaurantName: restaurant.name,
//         restaurantAddress: restaurant.address,
//         restaurantCity: restaurant.city,
//         foodItemId: itemId,
//         itemName: data.item.itemName,
//         imageUrl: data.item.imageUrl,
//         price: data.item.price,
//         quantity,
//       });

//       setTimeout(() => {
//         window.dispatchEvent(new Event("cart-change"));
//       }, 100);

//       alert("Added to cart");
//     } catch {
//       alert("Failed to add item to cart");
//     }
//   };

//   const increaseQty = () => setQuantity(q => q + 1);
//   const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

//   /* ================= AI ================= */

//   const fetchAiInfo = async () => {
//     try {
//       setAiLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}/ai-info`
//       );
//       setAiInfo(res.data.aiInfo);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   /* ================= FAV ================= */

//   const checkFavourite = async () => {
//     try {
//       const res = await apiUser.get(`/users/favourites/check/${itemId}`);
//       setIsFavourite(res.data === true);
//     } catch {
//       setIsFavourite(false);
//     }
//   };

//   const toggleFavourite = async () => {
//     if (!isLoggedIn) return openSignupModal();

//     setFavLoading(true);
//     try {
//       if (isFavourite) {
//         await apiUser.delete(`/users/favourites/remove/${itemId}`);
//         setIsFavourite(false);
//       } else {
//         await apiUser.post("/users/favourites/add", {
//           restaurantId,
//           foodItemId: itemId,
//           itemName: data.item.itemName,
//           price: data.item.price,
//         });
//         setIsFavourite(true);
//       }
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   /* ================= RATING COLOR ================= */

//   const getRatingColor = (rating) => {
//     if (rating >= 4) return "#2ecc71";
//     if (rating >= 2.5) return "#f39c12";
//     return "#e74c3c";
//   };

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p>Item not found</p>;

//   const { item, averageRating, totalRatings, reviews } = data;

//   return (
//     <div className="item-page">

//       <button className="back-btn" onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       <div className="image-wrapper">
//         <img className="item-image" src={item.imageUrl} alt={item.itemName} />
//         <button
//           className={`fav-btn ${isFavourite ? "active" : ""}`}
//           onClick={toggleFavourite}
//           disabled={favLoading}
//         >
//           {isFavourite ? "♥" : "♡"}
//         </button>
//       </div>

//       <div className="item-header">
//         <h1>{item.itemName}</h1>

//         {restaurant && (
//           <p className="restaurant-info">
//             <strong>{restaurant.name}</strong> • {restaurant.address}, {restaurant.city}
//           </p>
//         )}

//         <div className="rating-row">
//           <span
//             className="rating-badge"
//             style={{ backgroundColor: getRatingColor(averageRating) }}
//           >
//             {averageRating.toFixed(1)} ★
//           </span>
//           <span className="rating-count">{totalRatings} ratings</span>
//         </div>
//       </div>

//       <div className="price-row">
//         <span className="price">₹{item.price}</span>

//         <div className="qty-control">
//           <button onClick={decreaseQty}>−</button>
//           <span>{quantity}</span>
//           <button onClick={increaseQty}>+</button>
//         </div>

//         <button className="add-btn" onClick={addToCart}>
//           Add to cart
//         </button>
//       </div>

//       <p className="desc">{item.description}</p>

//       {/* ================= AI CARD ================= */}
//       <div className="ai-card">
//         <div className="ai-header">
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <SiOpenai size={22} color="#10a37f" />
//             <span>AI Food Insights</span>
//           </div>

//           {!aiInfo && (
//             <button onClick={fetchAiInfo}>
//               {aiLoading ? "Loading..." : "View"}
//             </button>
//           )}
//         </div>

//         {aiInfo && (
//           <div className="ai-text">
//             <ReactMarkdown>{aiInfo}</ReactMarkdown>

//             <div
//               style={{
//                 marginTop: "10px",
//                 fontSize: "12px",
//                 color: "#888",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px"
//               }}
//             >
//               <SiOpenai size={14} />
//               <span>Response generated by ChatGPT</span>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ================= REVIEWS ================= */}
//       <div className="reviews">
//         <h3>Customer Reviews</h3>

//         {reviews.length === 0 && <p>No reviews yet</p>}

//         {reviews.map((r, i) => (
//           <div key={i} className="review-card">
//             <strong>{r.userName}</strong>
//             <span>{r.rating} ★</span>
//             <p>{r.review}</p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";

// import api from "../api/axios";        // 9092 → restaurant service
// import apiUser from "../api/apiUser";  // 9091 → user service

// import "./ItemDetails.css";

// export default function ItemDetails() {
//   const { restaurantId, itemId } = useParams();
//   const navigate = useNavigate();

//   /* ================= AUTH ================= */

//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const user = isLoggedIn
//     ? JSON.parse(localStorage.getItem("user"))
//     : null;

//   /* ================= STATE ================= */

//   const [data, setData] = useState(null);
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   // AI
//   const [aiInfo, setAiInfo] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   // Review
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");

//   // Favourite
//   const [isFavourite, setIsFavourite] = useState(false);
//   const [favLoading, setFavLoading] = useState(false);

//   /* ================= INIT ================= */

//   useEffect(() => {
//     fetchItemDetails();
//     fetchRestaurantDetails();
//     if (isLoggedIn) checkFavourite();
//     // eslint-disable-next-line
//   }, [itemId]);

//   /* ================= ITEM (9092) ================= */

//   const fetchItemDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}`
//       );
//       setData(res.data);
//     } catch (e) {
//       console.error("Item fetch failed", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RESTAURANT (9092) ================= */

//   const fetchRestaurantDetails = async () => {
//     try {
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}`
//       );
//       setRestaurant(res.data);
//     } catch (e) {
//       console.error("Restaurant fetch failed", e);
//     }
//   };

//   /* ================= AUTH ================= */

//   const openSignupModal = () => {
//     window.dispatchEvent(new Event("open-auth"));
//   };

//   /* ================= CART (9091) ================= */

//   const addToCart = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     if (!data || !restaurant) {
//       alert("Please wait, loading...");
//       return;
//     }

//     try {
//       await apiUser.post("/users/cart/add", {
//         restaurantId,

//         // restaurant snapshot
//         restaurantName: restaurant.name,
//         restaurantAddress: restaurant.address,
//         restaurantCity: restaurant.city,

//         // item snapshot
//         foodItemId: itemId,
//         itemName: data.item.itemName,
//         imageUrl: data.item.imageUrl,
//         price: data.item.price,
//         quantity,
//       });

//       // ✅ CART UPDATE EVENT (AFTER SUCCESS)
//      setTimeout(() => {
//   window.dispatchEvent(new Event("cart-change"));
// },100);

//       alert("Added to cart");
//     } catch (e) {
//       console.error("Add to cart failed", e);
//       alert("Failed to add item to cart");
//     }
//   };

//   const increaseQty = () => setQuantity(q => q + 1);
//   const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

//   /* ================= REVIEW ================= */

//   const submitReview = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     if (!rating || !reviewText.trim()) return;

//     await api.post("/api/reviews/add", {
//       restaurantId,
//       itemId,
//       rating,
//       review: reviewText,
//       userName: user?.name || "Anonymous",
//     });

//     setRating(0);
//     setReviewText("");
//     fetchItemDetails();
//   };

//   /* ================= AI ================= */

//   const fetchAiInfo = async () => {
//     try {
//       setAiLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}/ai-info`
//       );
//       setAiInfo(res.data.aiInfo);
//     } finally {
//       setAiLoading(false);
//     }
//   };

//   /* ================= FAVOURITES ================= */

//   const checkFavourite = async () => {
//     try {
//       const res = await apiUser.get(
//         `/users/favourites/check/${itemId}`
//       );
//       setIsFavourite(res.data === true);
//     } catch {
//       setIsFavourite(false);
//     }
//   };

//   const toggleFavourite = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     try {
//       setFavLoading(true);

//       if (isFavourite) {
//         await apiUser.delete(`/users/favourites/remove/${itemId}`);
//         setIsFavourite(false);
//       } else {
//         await apiUser.post("/users/favourites/add", {
//           restaurantId,
//           foodItemId: itemId,
//           itemName: data.item.itemName,
//           price: data.item.price,
//         });
//         setIsFavourite(true);
//       }
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p>Item not found</p>;

//   const { item, averageRating, totalRatings, reviews } = data;

//   return (
//     <div className="item-page">

//       <button className="back-btn" onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       {/* IMAGE */}
//       <div className="image-wrapper">
//         <img
//           className="item-image"
//           src={item.imageUrl}
//           alt={item.itemName}
//         />

//         <button
//           className={`fav-btn ${isFavourite ? "active" : ""}`}
//           onClick={toggleFavourite}
//           disabled={favLoading}
//         >
//           {isFavourite ? "♥" : "♡"}
//         </button>
//       </div>

//       {/* HEADER */}
//       <div className="item-header">
//         <h1>{item.itemName}</h1>

//         {restaurant && (
//           <p className="restaurant-info">
//             <strong>{restaurant.name}</strong> •{" "}
//             {restaurant.address}, {restaurant.city}
//           </p>
//         )}

//         <div className="rating-row">
//           <span className="rating-badge">
//             {averageRating.toFixed(1)} ★
//           </span>
//           <span className="rating-count">
//             {totalRatings} ratings
//           </span>
//         </div>
//       </div>

//       {/* PRICE */}
//       <div className="price-row">
//         <span className="price">₹{item.price}</span>

//         <div className="qty-control">
//           <button onClick={decreaseQty}>−</button>
//           <span>{quantity}</span>
//           <button onClick={increaseQty}>+</button>
//         </div>

//         <button className="add-btn" onClick={addToCart}>
//           Add to cart
//         </button>
//       </div>

//       <p className="desc">{item.description}</p>

//       {/* AI */}
//       <div className="ai-card">
//         <div className="ai-header">
//           <span>AI Food Insights</span>
//           {!aiInfo && (
//             <button onClick={fetchAiInfo}>
//               {aiLoading ? "Loading..." : "View"}
//             </button>
//           )}
//         </div>

//         {aiInfo && (
//           <div className="ai-text">
//             <ReactMarkdown>{aiInfo}</ReactMarkdown>
//           </div>
//         )}
//       </div>

//       {/* REVIEWS */}
//       <div className="reviews">
//         <h3>Customer Reviews</h3>

//         {reviews.length === 0 && <p>No reviews yet</p>}

//         {reviews.map((r, i) => (
//           <div key={i} className="review-card">
//             <strong>{r.userName}</strong>
//             <span>{r.rating} ★</span>
//             <p>{r.review}</p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import ReactMarkdown from "react-markdown";

// import api from "../api/axios";        // 9092 → restaurant service
// import apiUser from "../api/apiUser";  // 9091 → user service

// import "./ItemDetails.css";

// export default function ItemDetails() {
//   const { restaurantId, itemId } = useParams();
//   const navigate = useNavigate();

//   // 🔐 AUTH
//   const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
//   const user = isLoggedIn
//     ? JSON.parse(localStorage.getItem("user"))
//     : null;

//   // DATA
//   const [data, setData] = useState(null);         // item + ratings
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   // AI
//   const [aiInfo, setAiInfo] = useState(null);
//   const [aiLoading, setAiLoading] = useState(false);

//   // REVIEW
//   const [rating, setRating] = useState(0);
//   const [reviewText, setReviewText] = useState("");

//   // ❤️ FAVOURITE
//   const [isFavourite, setIsFavourite] = useState(false);
//   const [favLoading, setFavLoading] = useState(false);

//   useEffect(() => {
//     fetchItemDetails();
//     fetchRestaurantDetails();
//     if (isLoggedIn) checkFavourite();
//     // eslint-disable-next-line
//   }, [itemId]);

//   // ================= ITEM (9092) =================
//   const fetchItemDetails = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}`
//       );
//       setData(res.data);
//     } catch (e) {
//       console.error("Item fetch failed", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ================= RESTAURANT (9092) =================
//   const fetchRestaurantDetails = async () => {
//     try {
//       const res = await api.get(
//         `/api/guest/restaurants/${restaurantId}`
//       );
//       setRestaurant(res.data);
//     } catch (e) {
//       console.error("Restaurant fetch failed", e);
//     }
//   };

//   // ================= AUTH =================
//   const openSignupModal = () => {
//     window.dispatchEvent(new Event("open-auth"));
//   };

//   // ================= CART (9091) =================
//   const addToCart = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     if (!data || !restaurant) {
//       alert("Please wait, loading...");
//       return;
//     }
//      window.dispatchEvent(new Event("cart-change"));
//     await apiUser.post("/users/cart/add", {
//       restaurantId,

//       // ✅ restaurant snapshot
//       restaurantName: restaurant.name,
//       restaurantAddress: restaurant.address,
//       restaurantCity: restaurant.city,

//       // ✅ item snapshot
//       foodItemId: itemId,
//       itemName: data.item.itemName,
//       imageUrl: data.item.imageUrl,
//       price: data.item.price,
//       quantity,
//     });

//     alert("Added to cart");
//   };

//   const increaseQty = () => setQuantity(q => q + 1);
//   const decreaseQty = () => setQuantity(q => Math.max(1, q - 1));

//   // ================= REVIEW =================
//   const submitReview = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     if (!rating || !reviewText.trim()) return;

//     await api.post("/api/reviews/add", {
//       restaurantId,
//       itemId,
//       rating,
//       review: reviewText,
//       userName: user?.name || "Anonymous",
//     });

//     setRating(0);
//     setReviewText("");
//     fetchItemDetails();
//   };

//   // ================= AI =================
//   const fetchAiInfo = async () => {
//     setAiLoading(true);
//     const res = await api.get(
//       `/api/guest/restaurants/${restaurantId}/menu/item/${itemId}/ai-info`
//     );
//     setAiInfo(res.data.aiInfo);
//     setAiLoading(false);
//   };

//   // ================= FAVOURITES =================
//   const checkFavourite = async () => {
//     try {
//       const res = await apiUser.get(
//         `/users/favourites/check/${itemId}`
//       );
//       setIsFavourite(res.data === true);
//     } catch {
//       setIsFavourite(false);
//     }
//   };

//   const toggleFavourite = async () => {
//     if (!isLoggedIn) {
//       openSignupModal();
//       return;
//     }

//     try {
//       setFavLoading(true);

//       if (isFavourite) {
//         await apiUser.delete(`/users/favourites/remove/${itemId}`);
//         setIsFavourite(false);
//       } else {
//         await apiUser.post("/users/favourites/add", {
//           restaurantId,
//           foodItemId: itemId,
//           itemName: data.item.itemName,
//           price: data.item.price,
//         });
//         setIsFavourite(true);
//       }
//     } finally {
//       setFavLoading(false);
//     }
//   };

//   // ================= UI =================
//   if (loading) return <p className="loading">Loading...</p>;
//   if (!data) return <p>Item not found</p>;

//   const { item, averageRating, totalRatings, reviews } = data;

//   return (
//     <div className="item-page">

//       <button className="back-btn" onClick={() => navigate(-1)}>
//         ← Back
//       </button>

//       {/* IMAGE */}
//       <div className="image-wrapper">
//         <img
//           className="item-image"
//           src={item.imageUrl}
//           alt={item.itemName}
//         />

//         <button
//           className={`fav-btn ${isFavourite ? "active" : ""}`}
//           onClick={toggleFavourite}
//           disabled={favLoading}
//         >
//           {isFavourite ? "♥" : "♡"}
//         </button>
//       </div>

//       {/* HEADER */}
//       <div className="item-header">
//         <h1>{item.itemName}</h1>

//         {/* ✅ RESTAURANT INFO */}
//         {restaurant && (
//           <p className="restaurant-info">
//             <strong>{restaurant.name}</strong> •{" "}
//             {restaurant.address}, {restaurant.city}
//           </p>
//         )}

//         <div className="rating-row">
//           <span className="rating-badge">
//             {averageRating.toFixed(1)} ★
//           </span>
//           <span className="rating-count">
//             {totalRatings} ratings
//           </span>
//         </div>
//       </div>

//       {/* PRICE */}
//       <div className="price-row">
//         <span className="price">₹{item.price}</span>

//         <div className="qty-control">
//           <button onClick={decreaseQty}>−</button>
//           <span>{quantity}</span>
//           <button onClick={increaseQty}>+</button>
//         </div>

//         <button className="add-btn" onClick={addToCart}>
//           Add to cart
//         </button>
//       </div>

//       <p className="desc">{item.description}</p>

//       {/* AI */}
//       <div className="ai-card">
//         <div className="ai-header">
//           <span>AI Food Insights</span>
//           {!aiInfo && (
//             <button onClick={fetchAiInfo}>
//               {aiLoading ? "Loading..." : "View"}
//             </button>
//           )}
//         </div>

//         {aiInfo && (
//           <div className="ai-text">
//             <ReactMarkdown>{aiInfo}</ReactMarkdown>
//           </div>
//         )}
//       </div>

//       {/* REVIEWS */}
//       <div className="reviews">
//         <h3>Customer Reviews</h3>

//         {reviews.length === 0 && <p>No reviews yet</p>}

//         {reviews.map((r, i) => (
//           <div key={i} className="review-card">
//             <strong>{r.userName}</strong>
//             <span>{r.rating} ★</span>
//             <p>{r.review}</p>
//           </div>
//         ))}
//       </div>

//     </div>
//   );
// }
