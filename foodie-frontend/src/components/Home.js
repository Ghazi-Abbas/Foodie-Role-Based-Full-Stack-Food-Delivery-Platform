import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import OfferBanner from "./guest/Banner/OfferBanner";


export default function Home() {
    const navigate = useNavigate();
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero">
        <img
          src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=1600"
          className="hero-bg"
          alt="Food delivery"
        />
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <h2>
            Order food from
            <br />
            <span>restaurants near you</span>
          </h2>

          <p>
            Fresh meals, trusted restaurants, and fast delivery — right to your doorstep.
          </p>

          <div className="hero-cta"  onClick={()=>navigate("/delivery")}>
            <input placeholder="Enter your delivery location" />
            <button>Find Food</button>
          </div>
        </div>
      </section>

      {/* ================= OFFER BANNERS ================= */}
      <section className="offers" onClick={() => navigate("/delivery")} >
        <div className="offer-card orange"  >
          <h4>Flat ₹150 OFF</h4>
          <p>Use code <strong>FOODIE150</strong></p>
        </div>

        <div className="offer-card blue"  >
          <h4>20% Cashback</h4>
          <p>Pay via UPI / Wallet</p>
        </div>

        <div className="offer-card green">
          <h4>Free Delivery</h4>
          <p>On orders above ₹199</p>
        </div>
      </section>

      {/* ================= ADVERTISEMENT ================= */}
      {/* <section className="ad-banner">
        <img
          src="https://images.pexels.com/photos/616401/pexels-photo-616401.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Advertisement"
        />
        <div className="ad-text">
          <h3>Special Weekend Deals</h3>
          <p>Up to 40% off on selected restaurants</p>
        </div>
      </section> */}

      <section onClick={() => navigate("/delivery")}>

        <OfferBanner   />
      </section>
       

      {/* ================= CATEGORIES ================= */}
      <section className="categories" onClick={() => navigate("/delivery")}>
        <h3>What are you craving today?</h3>

        <div className="category-row">
          {[
            { name: "Pizza", img: "https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Biryani", img: "https://images.pexels.com/photos/5410400/pexels-photo-5410400.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Burgers", img: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Chinese", img: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Desserts", img: "https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=600" },
            { name: "Healthy", img: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=600" },
          ].map((cat) => (
            <div className="category-card" key={cat.name}>
              <img src={cat.img} alt={cat.name} />
              <p>{cat.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= RESTAURANTS ================= */}
      <section className="restaurants" onClick={() => navigate("/dining")}>
        <h3>Restaurants near you</h3>

        <div className="restaurant-grid">
          {[
            {
              name: "Spice Hub",
              img: "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=600",
              cuisine: "Indian • Biryani • ₹₹",
              rating: "4.4",
              time: "30–35 min",
              offer: "₹100 OFF above ₹299",
            },
            {
              name: "Urban Bites",
              img: "https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=600",
              cuisine: "Burgers • Fast Food • ₹₹",
              rating: "4.2",
              time: "25–30 min",
              offer: "Free Delivery",
            },
            {
              name: "Pizza Factory",
              img: "https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=600",
              cuisine: "Italian • Pizza • ₹₹₹",
              rating: "4.5",
              time: "35–40 min",
              offer: "20% OFF up to ₹120",
            },
          ].map((res) => (
            <div className="restaurant-card" key={res.name}>
              <div className="discount-strip">{res.offer}</div>
              <img src={res.img} alt={res.name} />

              <div className="restaurant-info">
                <h4>{res.name}</h4>
                <p>{res.cuisine}</p>
                <div className="meta">
                  <span>⭐ {res.rating}</span>
                  <span>{res.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

       {/* ================= FEATURES ================= */}
      <section className="feature-full-section">
        <div className="feature-row">
          <div className="feature-text" onClick={() => navigate("/dining")}>
            <h2>Verified restaurants</h2>
            <p>
              Every restaurant is checked for hygiene, quality, and consistency
              before being listed on Foodie.
            </p>
          </div>
          <div className="feature-img" onClick={() => navigate("/dining")}>
            <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800" alt="" />
          </div>
        </div>

        <div className="feature-row reverse" onClick={() => navigate("/delivery")}>
          <div className="feature-text">
            <h2>Clear food information</h2>
            <p>
              Ingredients, portion size, and nutrition details are clearly displayed
              so you can make informed choices.
            </p>
          </div>
          <div className="feature-img">
            <img src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800" alt="" />
          </div>
        </div>

        <div className="feature-row">
          <div className="feature-text">
            <h2>Reliable delivery partners</h2>
            <p>
              Live tracking, accurate ETAs, and trained delivery partners ensure
              your food arrives safely and on time.
            </p>
          </div>
          <div className="feature-img">
            <img src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=800" alt="" />
          </div>
        </div>
      </section>

      

      {/* ================= APP PROMO ================= */}
      <section className="app-promo">
        <h2>Foodie app coming soon</h2>
        <p>
          Faster ordering, exclusive offers, and a smoother experience on mobile.
        </p>
      </section>
    </>
  );
}
