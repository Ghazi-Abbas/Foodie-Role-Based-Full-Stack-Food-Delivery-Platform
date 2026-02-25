import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./MainLayout";

import Delivery from "./pages/Delivery";
import DiningOut from "./pages/DiningOut";
import Nightlife from "./pages/Nightlife";
import RestaurantDetails from "./pages/RestaurantDetails";
import SearchPage from "./Search/SearchPage"; // ✅ ADDED
import ItemDetails from "./pages/ItemDetails";


export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/dining" element={<DiningOut />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/nightlife" element={<Nightlife />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
 {/* ✅ THIS WAS MISSING */}
        {/* <Route
          path="/restaurant/:restaurantId/item/:itemId"
          element={<ItemDetails />}
        /> */}
        {/* 🔥 SEARCH ROUTE (THIS WAS MISSING) */}
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  );
}
