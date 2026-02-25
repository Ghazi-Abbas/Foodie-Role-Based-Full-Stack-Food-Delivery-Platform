// // components/Delivery/FoodDiscoveryRow.js
// import { useRef } from "react";
// import "./FoodDiscoveryRow.css";

// export default function FoodDiscoveryRow({ title, items,onItemClick }) {
//   const rowRef = useRef(null);
//   const CARD_SCROLL = 300;

//   const scrollLeft = () => {
//     if (!rowRef.current) return;
//     rowRef.current.scrollBy({ left: -CARD_SCROLL, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     if (!rowRef.current) return;
//     rowRef.current.scrollBy({ left: CARD_SCROLL, behavior: "smooth" });
//   };

//   return (
//     <section className="z-discovery">
//       <div className="z-header">
//         <h2>{title}</h2>
//         <span className="z-see-all">See all</span>
//       </div>

//       {/* arrows */}
//       <button className="z-arrow left" onClick={scrollLeft}>‹</button>
//       <button className="z-arrow right" onClick={scrollRight}>›</button>

//       <div className="z-row" ref={rowRef}>
//         {items.map((item, index) => (
//           <div className="z-card" key={item.itemId || index}>
//             <img src={item.imageUrl} alt={item.name} />

//             {/* rating */}
//             <div className="z-rating">
//               ★ {item.averageRating || "4.2"}
//             </div>

//             {/* content */}
//             <div className="z-overlay">
//               <p className="z-hook">
//                 {index % 2 === 0 ? "Most loved" : "Popular choice"}
//               </p>

//               <h4 className="z-name">{item.name}</h4>

//               <div className="z-meta">
//                 <span>₹{item.price}</span>
//                 <span className="dot">•</span>
//                 <span>30 mins</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
import { useRef } from "react";
import "./FoodDiscoveryRow.css";

export default function FoodDiscoveryRow({ title, items, onItemClick }) {
  const rowRef = useRef(null);
  const CARD_SCROLL = 300;

  const scrollLeft = () => {
    rowRef.current?.scrollBy({ left: -CARD_SCROLL, behavior: "smooth" });
  };

  const scrollRight = () => {
    rowRef.current?.scrollBy({ left: CARD_SCROLL, behavior: "smooth" });
  };

  return (
    <section className="z-discovery">
      <div className="z-header">
        <h2>{title}</h2>
        <span className="z-see-all">See all</span>
      </div>

      <button className="z-arrow left" onClick={scrollLeft}>‹</button>
      <button className="z-arrow right" onClick={scrollRight}>›</button>

      <div className="z-row" ref={rowRef}>
        {items.map((item, index) => (
          <div
            className="z-card"
            key={item.itemId || index}
            onClick={() => onItemClick(item)}   // ✅ NAVIGATION
            style={{ cursor: "pointer" }}
          >
            <img src={item.imageUrl} alt={item.name} />

            <div className="z-rating">
              ★ {item.averageRating || "4.2"}
            </div>

            <div className="z-overlay">
              <p className="z-hook">
                {index % 2 === 0 ? "Most loved" : "Popular choice"}
              </p>

              <h4 className="z-name">{item.name}</h4>

              <div className="z-meta">
                <span>₹{item.price}</span>
                <span className="dot">•</span>
                <span>30 mins</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
