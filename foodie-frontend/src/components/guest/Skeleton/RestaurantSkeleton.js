import "./Skeleton.css";

export default function RestaurantSkeleton() {
  return (
    <div className="restaurant-skeleton">
      <div className="skeleton" style={{ height: 210 }} />

      <div style={{ padding: 14 }}>
        <div className="skeleton" style={{ height: 18, width: "70%" }} />
        <div
          className="skeleton"
          style={{ height: 14, width: "50%", marginTop: 10 }}
        />
        <div
          className="skeleton"
          style={{ height: 14, width: "40%", marginTop: 10 }}
        />
      </div>
    </div>
  );
}
