import "./RestaurantReviews.css";
import { useEffect, useState } from "react";
import axios from "axios";

export default function RestaurantReviews() {
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const restaurantId = localStorage.getItem("restaurantId");
  const token = localStorage.getItem("token");

  /* ================= LOAD REVIEWS ================= */
  useEffect(() => {
    if (!restaurantId || !token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get(
        `http://localhost:9092/api/reviews/restaurant/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [];
        setReviews(data);

        // ⭐ Average rating (safe)
        if (data.length > 0) {
          const total = data.reduce(
            (sum, r) => sum + (Number(r.rating) || 0),
            0
          );
          setAvgRating(total / data.length);
        } else {
          setAvgRating(0);
        }
      })
      .catch(err => {
        console.error("REVIEWS API ERROR:", err);
        setReviews([]);
        setAvgRating(0);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurantId, token]);

  /* ================= UI ================= */
  return (
    <div className="reviews-page">
      {/* HEADER */}
      <div className="reviews-header">
        <div>
          <h1>Reviews & Ratings</h1>
          <p>Customer feedback for your restaurant</p>
        </div>

        <div className="rating-summary">
          <div className="rating-score">
            {avgRating.toFixed(1)}
          </div>
          <div className="rating-label">
            Average Rating
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="reviews-list">
        {loading ? (
          <p className="empty-text">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="empty-text">
            No reviews received yet
          </p>
        ) : (
          reviews.map(review => {
            const rating = Number(review.rating) || 0;

            return (
              <div
                key={review.id || review._id}
                className="review-card"
              >
                <div className="review-header">
                  <div>
                    <strong>
                      {review.userName || "Customer"}
                    </strong>
                    <span className="review-date">
                      {review.createdAt
                        ? new Date(
                            review.createdAt
                          ).toLocaleString()
                        : "--"}{" "}
                      {review.orderId && (
                        <>• Order {review.orderId.slice(-6)}</>
                      )}
                    </span>
                  </div>

                  <div className="stars">
                    {"★".repeat(rating)}
                    {"☆".repeat(5 - rating)}
                  </div>
                </div>

                <p className="review-comment">
                  {review.review || "No comment provided"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
