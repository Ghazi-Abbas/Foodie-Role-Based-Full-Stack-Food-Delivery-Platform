import "../admin.css";
export default function Header({ title }) {
  return (
    <div className="admin-header">
      <h1>{title}</h1>
    </div>
  );
}
