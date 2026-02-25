import { Routes, Route, Navigate } from "react-router-dom";
import RestaurantLayout from "./layout/RestaurantLayout";

import DashboardHome from "./pages/DashboardHome";
import RestaurantStatus from "./pages/RestaurantStatus";
import LiveOrders from "./pages/LiveOrders";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import Menu from "./pages/Menu";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import OrderHistory from "./pages/OrderHistory";
import MenuManagement from "./pages/MenuManagement";
import RestaurantReviews from "./pages/RestaurantReviews";
import Earnings from "./pages/Earnings";




export default function RestaurantDetailsRoutes() {
  return (
    <RestaurantLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<DashboardHome />} />
        <Route path="status" element={<RestaurantStatus />} />
        <Route path="live-orders" element={<LiveOrders />} />
<Route path="reviews" element={<RestaurantReviews />} />
<Route path="earnings" element={<Earnings />} />
        
        <Route path="orders/:id" element={<OrderDetails />} />
        <Route path="orders" element={<OrderHistory />} />
<Route path="orders/:id" element={<OrderDetails />} />


        <Route path="menu" element={<MenuManagement  />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </RestaurantLayout>
  );
}
