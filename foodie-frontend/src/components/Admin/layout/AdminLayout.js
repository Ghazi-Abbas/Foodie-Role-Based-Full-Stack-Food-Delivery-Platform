import Sidebar from "./Sidebar";
import "../admin.css";

export default function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="admin-content">{children}</main>
    </div>
  );
}
