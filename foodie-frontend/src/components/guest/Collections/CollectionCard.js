import "./CollectionCard.css";

export default function CollectionCard({ image, title, places }) {
  return (
    <div className="collection-card">
      <img src={image} alt={title} />

      <div className="overlay">
        <h4>{title}</h4>
        <p>{places} Places</p>
      </div>
    </div>
  );
}
