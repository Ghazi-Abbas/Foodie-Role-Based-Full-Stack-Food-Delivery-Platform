import "./BrandCard.css";

export default function BrandCard({ brand }) {
  return (
    <div className="brand-card">
      <div className="brand-logo">
        <img src={brand.logo} alt={brand.name} />
      </div>

      <div className="brand-name">{brand.name}</div>
      <div className="brand-time">{brand.time}</div>
    </div>
  );
}
