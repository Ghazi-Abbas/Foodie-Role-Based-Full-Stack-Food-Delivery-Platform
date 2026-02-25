import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import AuthDrawer from "./components/AuthDrawer";
import Profile from "./Profile/Profile";
import { AuthProvider } from "./context/AuthContext";

import RestaurantDetailsRoutes from "./components/RestaurantDetail/RestaurantDetailsRoutes";

import ProtectedRoute from "./routes/ProtectedRoute";

import { Toaster } from "react-hot-toast";
import Checkout from "./components/Checkout";
import Payment from "./payment/Payment";
import FloatingChat from "./components/ChatBot/FloatingChat";
import Form from "./components/RestrurantsForm/Form";

import AdminRoutes from "./components/Admin/AdminRoutes";
import AppRoutes from "./components/guest/AppRoutes";
import DiningOut from "./components/guest/pages/DiningOut";
import Delivery from "./components/guest/pages/Delivery";
import Nightlife from "./components/guest/pages/Nightlife";
import MainLayout from "./components/guest/MainLayout";

import PartnerStatus from "./Profile/PartnerStatus";
import ItemDetails from "./components/guest/pages/ItemDetails";
import RestaurantDetails from "./components/guest/pages/RestaurantDetails";
import SearchPage from "./components/guest/Search/SearchPage";


function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}


// ========================
// APP CONTENT
// ========================
// function AppContent() {

//   const [openAuth, setOpenAuth] = useState(false);

//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   // read user + role
//   const user = {
//     loggedIn: localStorage.getItem("isLoggedIn") === "true",
//     id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
//     role: (localStorage.getItem("role") || "").toUpperCase()
//   };

//   // ========================
//   // ADMIN PROTECTOR
//   // ========================
//   const AdminGuard = () => {
//   if (!user.loggedIn) return <Navigate to="/" replace />;

//   let role = (localStorage.getItem("role") || "").toUpperCase();
//   if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

//   if (role !== "ADMIN")
//     return <Navigate to="/" replace />;

//   return <AdminRoutes />;
// };


//   return (
//     <>
//       {/* NAVBAR ONLY FOR NORMAL USER PAGES */}
//       {!isAdminRoute && <Navbar openAuth={() => setOpenAuth(true)} />}

//       {/* ================= ADMIN ROUTES ================= */}
//       {isAdminRoute ? (
//         <AdminGuard />
//       ) : (
//         <>
//           {/* ================= NORMAL USER ROUTES ================= */}
//           <Routes>

//             {/* PUBLIC ROUTES */}
//             <Route path="/" element={<Home />} />
//             <Route path="/Payment" element={<Payment />} />
//             <Route path="/Rest" element={<Form />} />

//             {/* PROTECTED ROUTES */}
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Profile />
//                 </ProtectedRoute>
//               }
//             />

//             <Route
//               path="/checkout"
//               element={
//                 <ProtectedRoute>
//                   <Checkout />
//                 </ProtectedRoute>
//               }
//             />

//           </Routes>

//           {/* AUTH DRAWER */}
//           {openAuth && (
//             <AuthDrawer close={() => setOpenAuth(false)} />
//           )}

//           {/* CHATBOT */}
//           <FloatingChat user={user} />

//           {/* FOOTER */}
//           <Footer />
//         </>
//       )}

//       <Toaster position="top-center" reverseOrder={false} />
//     </>
//   );
// }
// export default App;


function AppContent() {
  const [openAuth, setOpenAuth] = useState(false);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");
   const isRestaurantDashboard =
    location.pathname.startsWith("/restaurant-dashboard");

  const user = {
    loggedIn: localStorage.getItem("isLoggedIn") === "true",
    id: JSON.parse(localStorage.getItem("user") || "{}")?.id,
    role: (localStorage.getItem("role") || "").toUpperCase(),
  };

  // const AdminGuard = ({ children }) => {
  //   if (!user.loggedIn) return <Navigate to="/" replace />;

  //   let role = (localStorage.getItem("role") || "").toUpperCase();
  //   if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

  //   if (role !== "ADMIN") return <Navigate to="/" replace />;

  //   return children;
  // };


  const AdminGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = (payload.roles || []).map(r =>
      r.replace("ROLE_", "").toUpperCase()
    );

    if (!roles.includes("ADMIN")) {
      return <Navigate to="/" replace />;
    }

    return children;

  } catch {
    return <Navigate to="/" replace />;
  }
};

  const PartnerGuard = ({ children }) => {
  if (!user.loggedIn) return <Navigate to="/" replace />;

  let role = (localStorage.getItem("role") || "").toUpperCase();
  if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

  if (role !== "RESTAURANT_OWNER")
    return <Navigate to="/" replace />;

  return children;
};
// ================= OWNER GUARD =================
// const RestaurantOwnerGuard = ({ children }) => {
//   const token = localStorage.getItem("token");
//   if (!token) return <Navigate to="/" replace />;

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const roles = payload.roles || [];

//     if (!roles.includes("RESTAURANT_OWNER")) {
//       return <Navigate to="/partner" replace />;
//     }

//     return children;
//   } catch {
//     return <Navigate to="/" replace />;
//   }
// };

const RestaurantOwnerGuard = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = (payload.roles || []).map(r =>
      r.replace("ROLE_", "").toUpperCase()
    );

    if (!roles.includes("RESTAURANT_OWNER")) {
      return <Navigate to="/partner" replace />;
    }

    return children;

  } catch {
    return <Navigate to="/" replace />;
  }
};


  return (
    <>

    
      {/* Navbar only for non-admin */}
      {/* {!isAdminRoute && <Navbar openAuth={() => setOpenAuth(true)} />} */}

      {!isAdminRoute && !isRestaurantDashboard && (
  <Navbar openAuth={() => setOpenAuth(true)} />
)}

      {/* ================= ROUTES ================= */}
      <Routes>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/*"
          element={
            <AdminGuard>
              <AdminRoutes />
            </AdminGuard>
          }
        />

       {/* RESTAURANT DASHBOARD (OWNER ONLY) */}
  <Route
    path="/restaurant-dashboard/*"
    element={
      <RestaurantOwnerGuard>
        <RestaurantDetailsRoutes />
      </RestaurantOwnerGuard>
    }
  />


        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/Payment" element={<Payment />} />
       
      
        {/* ========== MainBROWSING ROUTES ========== */}
<Route element={<MainLayout />}>
  <Route path="/dining" element={<DiningOut />} />
  <Route path="/delivery" element={<Delivery />} />
  <Route path="/nightlife" element={<Nightlife />} />
   <Route path="/restaurant/:id" element={<RestaurantDetails />} />
   <Route
  path="/restaurant/:restaurantId/item/:itemId"
  element={<ItemDetails />}
/>
 {/* ✅ ADD THIS */}
  <Route path="/search" element={<SearchPage />} />
</Route>



     
        {/* ================= PROTECTED ================= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />


        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Register-form"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />
{/* PARTNER FLOW (ALL USERS) */}
  <Route
    path="partner-status"
    element={
      <ProtectedRoute>
        <PartnerStatus />
      </ProtectedRoute>
    }
  />

      </Routes>

      {/* AUTH DRAWER */}
     {openAuth && !isAdminRoute && !isRestaurantDashboard && (
  <AuthDrawer close={() => setOpenAuth(false)} />
)}
      {/* CHATBOT */}
      {!isAdminRoute && !isRestaurantDashboard &&<FloatingChat user={user} />}

      {/* FOOTER */}
      {!isAdminRoute && !isRestaurantDashboard && <Footer />}
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
export default App;

