import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./RestaurantDetails.css";

export default function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ==============================
     CORE STATES
  ============================== */
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ==============================
     MENU STATE
  ============================== */
  const [activeMenuCategory, setActiveMenuCategory] = useState("VEG");

  /* ==============================
     GALLERY MODAL STATE (NEW)
  ============================== */
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const categoryRefs = useRef({});

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      setLoading(true);
      const restaurantRes = await api.get(`/api/guest/restaurants/${id}`);
      setRestaurant(restaurantRes.data);

      const menuRes = await api.get(`/api/guest/restaurants/${id}/menu`);
      setCategories(menuRes.data?.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuCategoryClick = (category) => {
    setActiveMenuCategory(category);
    const section = categoryRefs.current[category];
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/restaurant/${id}/item/${itemId}`);
  };

  /* ==============================
     GALLERY HANDLERS
  ============================== */
  const galleryImages = restaurant
    ? [restaurant.imageUrl, restaurant.imageUrl, restaurant.imageUrl]
    : [];

  const openGallery = (index = 0) => {
    setActiveImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!restaurant) return <p>Restaurant not found</p>;

  return (
    <div className="zomato-page">

      {/* ============================
          RESTAURANT IMAGE GALLERY
      ============================ */}
      <section className="restaurant-gallery">
        <div className="gallery-main" onClick={() => openGallery(0)}>
          <img src={restaurant.imageUrl} alt={restaurant.name} />
        </div>

        <div className="gallery-side">
          <img src={restaurant.imageUrl} alt="" onClick={() => openGallery(1)} />
          <img src={restaurant.imageUrl} alt="" onClick={() => openGallery(2)} />
          <div className="gallery-more" onClick={() => openGallery(0)}>
            View Gallery
          </div>
        </div>
      </section>

      {/* HEADER */}
      <section className="zomato-header">
        <h1 className="restaurant-name">{restaurant.name}</h1>
        <p className="cuisines">
          Bar Food, North Indian, Chinese, Desserts, Beverages
        </p>
        <p className="address">
          {restaurant.address}, {restaurant.city}
        </p>
      </section>

      {/* CATEGORY BAR */}
      <div className="menu-category-bar">
        {categories.map((cat) => (
          <button
            key={cat.category}
            className={
              activeMenuCategory === cat.category
                ? "menu-cat active"
                : "menu-cat"
            }
            onClick={() => handleMenuCategoryClick(cat.category)}
          >
            {cat.category.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* MENU */}
      <div className="menu-content">
        {categories
          .filter((cat) => cat.category === activeMenuCategory)
          .map((cat) => (
            <div
              key={cat.category}
              ref={(el) => (categoryRefs.current[cat.category] = el)}
              className="menu-category-section"
            >
              <h2 className="menu-category-title">
                {cat.category.replace("_", " ")}
              </h2>

              <div className="menu-card-grid">
                {cat.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="menu-card clickable"
                    onClick={() => handleItemClick(item.itemId)}
                  >
                    <div className="menu-card-image">
                      <img src={item.imageUrl} alt={item.name} />
                      <span className="rating-pill">
                        {item.averageRating.toFixed(1)}★
                      </span>
                      <span
                        className={`veg-dot ${item.veg ? "veg" : "nonveg"}`}
                      />
                    </div>

                    <div className="menu-card-content">
                      <h4 className="item-name">{item.name}</h4>
                      <p className="item-price">₹{item.price} for one</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* ============================
          FULL SCREEN GALLERY MODAL
      ============================ */}
      {isGalleryOpen && (
        <div className="gallery-modal">
          <span className="gallery-close" onClick={closeGallery}>×</span>

          <button className="gallery-nav left" onClick={prevImage}>‹</button>

          <img
            src={galleryImages[activeImageIndex]}
            alt="Gallery"
            className="gallery-modal-image"
          />

          <button className="gallery-nav right" onClick={nextImage}>›</button>
        </div>
      )}
    </div>
  );
}
