import "./Skeleton.css";

export default function BrandSkeleton() {
  return (
    <div style={{ width: 140, textAlign: "center" }}>
      <div
        className="skeleton"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          margin: "auto",
        }}
      />
      <div
        className="skeleton"
        style={{ height: 14, width: "70%", margin: "10px auto" }}
      />
    </div>
  );
}
