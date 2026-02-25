import Tabs from "./Tabs/Tabs";
import { Outlet } from "react-router-dom";
import { useState } from "react";
// import "./MainLayout.css"; // ✅ ADD THIS

export default function MainLayout() {
  const [filters, setFilters] = useState({
    rating45: false,
    offers: false,
    openNow: false,
  });

  return (
    <>
      {/* Top navigation / tabs */}
      <Tabs />

      {/* 🔥 MAIN CONTENT AREA (VERY IMPORTANT) */}
      <main className="main-content">
        {/* 
          Filters can be re-enabled later if needed
          <Filters filters={filters} setFilters={setFilters} />
        */}
        <Outlet />
      </main>
    </>
  );
}
