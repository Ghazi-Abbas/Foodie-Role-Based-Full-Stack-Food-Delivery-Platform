import RestaurantSidebar from "./RestaurantSidebar";
import "../restaurant.css";

export default function RestaurantLayout({ children }) {
  return (
    <div className="restaurant-layout">
      <RestaurantSidebar />
      <main className="restaurant-main">
        {children}
      </main>
    </div>
  );
}
