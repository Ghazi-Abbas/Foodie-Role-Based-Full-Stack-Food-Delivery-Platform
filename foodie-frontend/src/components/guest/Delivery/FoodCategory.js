import "./FoodCategory.css";

export default function FoodCategory({ title, image }) {
  return (
    <div className="food-category">
      <img src={image} alt={title} />
      <p>{title}</p>
    </div>
  );
}
