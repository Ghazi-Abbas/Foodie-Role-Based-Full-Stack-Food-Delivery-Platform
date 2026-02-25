import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "./OfferBanner.css";

const banners = [
  {
    title: "Get up to",
    discount: "50% OFF",
    text: "On dining bills with Woody Pay",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Flat",
    discount: "30% OFF",
    text: "On your first order",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Bank Offer",
    discount: "20% OFF",
    text: "Using HDFC & ICICI cards",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Weekend Special",
    discount: "40% OFF",
    text: "At premium restaurants in Lucknow",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Date Night",
    discount: "35% OFF",
    text: "On romantic dining with Woody Pay",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function OfferBanner() {
  return (
     <div className="zomato-banner-wrapper">
     <Swiper
  modules={[Autoplay, Pagination, Navigation]}
  slidesPerView={1}
  spaceBetween={30}
  centeredSlides={true}
  loop={true}
  autoplay={{ delay: 4000, disableOnInteraction: false }}
  pagination={{ clickable: true }}
  navigation
  className="zomato-swiper"
>

        {banners.map((b, i) => (
          <SwiperSlide key={i}>
            <div className="zomato-banner">
              <img src={b.image} alt="food" className="zomato-bg" />

              <div className="zomato-overlay"></div>

              <div className="zomato-content">
                <span className="zomato-tag">WOODY PAY</span>
                <h2 className="tittle">{b.title}</h2>
                <h1>{b.discount}</h1>
                <p>{b.text}</p>
                <button>Explore Restaurants</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
