import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./layout/AdminLayout";

import Dashboard from "./pages/Dashboard";
import Owners from "./pages/Owners";
import Restaurants from "./pages/Restaurants";
import Analytics from "./pages/Analytics";
import DeliveryAgents from "./pages/DeliveryAgents";
import Memberships from "./pages/Memberships";
import KycDetails from "./pages/KycDetails";



export default function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="owners" element={<Owners />} />
        <Route path="/owners/:id" element={<KycDetails />} />
        <Route path="restaurants" element={<Restaurants />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="delivery-agents" element={<DeliveryAgents />} />
        <Route path="memberships" element={<Memberships />} />
      </Routes>
    </AdminLayout>
  );
}
