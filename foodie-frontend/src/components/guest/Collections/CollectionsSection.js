import "./CollectionsSection.css";
import CollectionCard from "./CollectionCard";
import { useRef } from "react";

const collections = [
  { id: 1, title: "Top trending spots", places: 35, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9" },
  { id: 2, title: "Insta-worthy spots", places: 29, image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1" },
  { id: 3, title: "Sky high sips", places: 32, image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836" },
  { id: 4, title: "North Indian hits", places: 37, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950" },
  { id: 5, title: "Best pubs & bars", places: 7, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b" },
  { id: 6, title: "Romantic dining", places: 21, image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0" },
  { id: 7, title: "Budget eats", places: 48, image: "https://images.unsplash.com/photo-1550547660-d9450f859349" },
  { id: 8, title: "Luxury dining", places: 14, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb" },
];

export default function CollectionsSection() {
  const scrollRef = useRef();

  const scroll = (dir) => {
    scrollRef.current.scrollBy({
      left: dir === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <div className="collections-section">

      <div className="collections-header">
        <div>
          <h2>Collections</h2>
          <p>
            Explore curated lists of top restaurants, cafes, pubs, and bars in Lucknow
          </p>
        </div>
        <span className="see-all">All collections in Lucknow →</span>
      </div>

      <div className="carousel-wrapper">
        <button className="scroll-btn left" onClick={() => scroll("left")}>‹</button>

        <div className="collections-carousel" ref={scrollRef}>
          {collections.map(item => (
            <CollectionCard key={item.id} {...item} />
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>›</button>
      </div>

    </div>
  );
}
