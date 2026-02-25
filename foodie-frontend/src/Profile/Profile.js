// import { useSearchParams } from "react-router-dom";
// import "./Profile.css";
// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
// import Addresses from "./Addresses";
// import Partner from "./Partner";
// import Orders from "./Orders";
// import Payments from "./Payments";
// import Events from "./Events";
// import Favourites from "./Favourites";
// import Settings from "./Settings";


// export default function Profile() {
//   const [params, setParams] = useSearchParams();
//   const tab = params.get("tab") || "orders";
//   const {user} = useContext (AuthContext);

//   return (
//     <div className="profile-page">
//       {/* HEADER */}
//       <div className="profile-header1">
//         <div className="profile-header-left">
//           <h1>{user.name}</h1>
//           <p>{user.email}</p>
//         </div>

//         <button
//           className="edit-profile-btn"
//           onClick={() => setParams({ tab: "settings" })}
//         >
//           Edit Profile
//         </button>
//       </div>

//       {/* BODY */}
//       <div className="profile-container">
//         {/* LEFT MENU */}
//         <div className="profile-sidebar">
//           {menu("orders", "Orders")}
//           {menu("favourites", "Favourites")}
//           {menu("payments", "Payments")}
//           {menu("addresses", "Addresses")}
//           {menu("settings", "Settings")}
//           {menu("events", "Food Events")}
//           {menu("partner", "Become a Partner")}
//         </div>

//         {/* RIGHT CONTENT */}
//         <div className="profile-content">
  

//   {tab === "orders" && <Orders />}
//   {tab === "payments" && <Payments />}
//   {tab === "addresses" && <Addresses />}
//   {tab === "favourites" && <Favourites />}
//   {tab === "settings" && <Settings />}
//   {tab === "events" && <Events />}
//   {tab === "partner" && <Partner />}

// </div>
//       </div>
//     </div>
//   );

//   function menu(key, label) {
//     return (
//       <div
//         className={`menu-item ${tab === key ? "active" : ""}`}
//         onClick={() => setParams({ tab: key })}
//       >
//         {label}
//       </div>
//     );
//   }
// }
import { useSearchParams, useNavigate } from "react-router-dom";
import "./Profile.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import Addresses from "./Addresses";
import Partner from "./Partner";
import Orders from "./Orders";
import Payments from "./Payments";
import Events from "./Events";
import Favourites from "./Favourites";
import Settings from "./Settings";

export default function Profile() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") || "orders";
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  /* 🔐 AUTH GUARD */
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  /* ⛔ PREVENT RENDER UNTIL USER EXISTS */
  if (!user) return null;

  return (
    <div className="profile-page">
      {/* HEADER */}
      <div className="profile-header1">
        <div className="profile-header-left">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>

        <button
          className="edit-profile-btn"
          onClick={() => setParams({ tab: "settings" })}
        >
          Edit Profile
        </button>
      </div>

      {/* BODY */}
      <div className="profile-container">
        {/* LEFT MENU */}
        <div className="profile-sidebar">
          {menu("orders", "Orders")}
          {menu("favourites", "Favourites")}
          {menu("payments", "Payments")}
          {menu("addresses", "Addresses")}
          {menu("settings", "Settings")}
          {menu("events", "Food Events")}
          {menu("partner", "Become a Partner")}
        </div>

        {/* RIGHT CONTENT */}
        <div className="profile-content">
          {tab === "orders" && <Orders />}
          {tab === "payments" && <Payments />}
          {tab === "addresses" && <Addresses />}
          {tab === "favourites" && <Favourites />}
          {tab === "settings" && <Settings />}
          {tab === "events" && <Events />}
          {tab === "partner" && <Partner />}
        </div>
      </div>
    </div>
  );

  function menu(key, label) {
    return (
      <div
        className={`menu-item ${tab === key ? "active" : ""}`}
        onClick={() => setParams({ tab: key })}
      >
        {label}
      </div>
    );
  }
}
