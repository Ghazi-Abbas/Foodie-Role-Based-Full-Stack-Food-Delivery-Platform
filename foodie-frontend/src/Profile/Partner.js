import "./Partner.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Partner = () => {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    async function loadRestaurant() {
      try {
        const res = await axios.get(
          "http://localhost:9092/restaurant-api/my-restaurant",
          { headers }
        );

        // ✅ normal restaurant (any status)
        setRestaurant(res.data || null);
      } catch (err) {
        // 🚫 PERMANENTLY_BLOCKED (403)
        if (err.response?.status === 403) {
          setBlocked(true);
        } else {
          // ❌ not registered
          setRestaurant(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, []);

  if (loading) return null;

  const status = restaurant?.status;
  const active = restaurant?.active;

  const permanentlyBlocked = blocked || status === "PERMANENTLY_BLOCKED";
  const isLive = status === "APPROVED" && active;

  /* ================= ACTION ================= */
  const handleAction = () => {
    if (permanentlyBlocked) return;

    if (!restaurant) {
      navigate("/Register-form");
      return;
    }

    if (isLive) {
      navigate("/restaurant-dashboard");
      return;
    }

    navigate("/partner-status");
  };

  /* ================= UI ================= */
  return (
    <div className="partner-hero">
      <div className="partner-inner">
        <div className="partner-overlay">

          {/* ===== HEADING ===== */}
          <h1>
            {permanentlyBlocked ? (
              <>Account <span>Blocked</span></>
            ) : restaurant ? (
              <>Your Restaurant on <span>Foodie</span></>
            ) : (
              <>
                Partner with <span>Foodie</span><br />
                and grow your business
              </>
            )}
          </h1>

          {/* ===== STATUS CARD ===== */}
          {permanentlyBlocked ? (
            <div className="partner-status-card danger">
              You are permanently blocked from operating restaurants on Foodie.
            </div>
          ) : !restaurant ? (
            <div className="offer-pill">
              <strong>0% commission for the first month</strong>
            </div>
          ) : status === "PENDING" ? (
            <div className="partner-status-card">
              Your application is under verification.
            </div>
          ) : status === "ON_HOLD" ? (
            <div className="partner-status-card">
              Action required on your application.
            </div>
          ) : status === "REJECTED" ? (
            <div className="partner-status-card">
              Your application was rejected.
            </div>
          ) : status === "SUSPENDED" ? (
            <div className="partner-status-card">
              Your restaurant is currently suspended.
            </div>
          ) : status === "APPROVED" && !active ? (
            <div className="partner-status-card">
              Your restaurant is approved. Go live to start receiving orders.
            </div>
          ) : (
            <div className="partner-status-card success">
              Your restaurant is live on Foodie.
            </div>
          )}

          {/* ===== BUTTON ===== */}
          {!permanentlyBlocked && (
            <button className="partner-btn" onClick={handleAction}>
              {!restaurant
                ? "Register Your Restaurant"
                : isLive
                ? "Open Restaurant Dashboard"
                : "View Status"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};

export default Partner;


// import "./Partner.css";
// import { useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Partner = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setRestaurant(null);
//       setLoading(false);
//       return;
//     }

//     let email;
//     try {
//       email = JSON.parse(atob(token.split(".")[1])).sub;
//     } catch {
//       setRestaurant(null);
//       setLoading(false);
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     async function loadRestaurant() {
//       setLoading(true);
//       try {
//         const endpoints = [
//           `/partner/${email}`,
//           `/owner/${email}`,
//           `/public/live/${email}`,
//         ];

//         for (const ep of endpoints) {
//           try {
//             const res = await axios.get(
//               `http://localhost:9092/restaurant-api${ep}`,
//               { headers }
//             );

//             if (Array.isArray(res.data) && res.data.length > 0) {
//               setRestaurant(res.data[0]);
//               return;
//             }
//           } catch {
//             // continue
//           }
//         }

//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadRestaurant();
//   }, [location.pathname]); // 🔥 refetch on navigation

//   if (loading) return null;

//   /* ================= STATUS FLAGS ================= */
//   const status = restaurant?.status;

//   const permanentlyBlocked = status === "PERMANENTLY_BLOCKED";
//   const rejected = status === "REJECTED";
//   const onHold = status === "ON_HOLD";
//   const suspended = status === "SUSPENDED";
//   const pending = status === "PENDING";
//   const approved = status === "APPROVED";
//   const isLive = approved && restaurant?.active === true;

//   /* ================= ENTRY NAVIGATION ================= */
//   const handleAction = () => {
//     if (permanentlyBlocked) return;

//     // ✅ ONLY live restaurants → dashboard
//     if (isLive) {
//       navigate("/restaurant-dashboard");
//       return;
//     }

//     // ✅ Registered but not live → FULL STATUS PAGE
//     if (restaurant) {
//       navigate("/partner-status");
//       return;
//     }

//     // ✅ Not registered
//     navigate("/Register-form");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="partner-hero">
//       <div className="partner-inner">
//         <div className="partner-overlay">

//           {/* ====== HEADING ====== */}
//           <h1>
//             {permanentlyBlocked ? (
//               <>Account <span>Blocked</span></>
//             ) : restaurant ? (
//               <>Your Restaurant on <span>Foodie</span></>
//             ) : (
//               <>
//                 Partner with <span>Foodie</span><br />
//                 and grow your business
//               </>
//             )}
//           </h1>

//           {/* ====== STATUS MESSAGE ====== */}
//           {permanentlyBlocked ? (
//             <div className="partner-status-card danger">
//               You are permanently blocked from operating restaurants on Foodie.
//             </div>
//           ) : rejected ? (
//             <div className="partner-status-card">
//               Your previous application was rejected.
//             </div>
//           ) : suspended ? (
//             <div className="partner-status-card">
//               Your restaurant is currently suspended.
//             </div>
//           ) : onHold ? (
//             <div className="partner-status-card">
//               Action required on your application.
//             </div>
//           ) : pending ? (
//             <div className="partner-status-card">
//               Your application is under verification.
//             </div>
//           ) : approved && !isLive ? (
//             <div className="partner-status-card">
//               Your restaurant is approved. Go live to start receiving orders.
//             </div>
//           ) : restaurant ? (
//             <div className="partner-status-card success">
//               Your restaurant is live on Foodie.
//             </div>
//           ) : (
//             <div className="offer-pill">
//               <strong>0% commission for the first month</strong>
//             </div>
//           )}

//           {/* ====== ACTION BUTTON ====== */}
//           {!permanentlyBlocked && (
//             <button className="partner-btn" onClick={handleAction}>
//               {isLive
//                 ? "Open Restaurant Dashboard"
//                 : restaurant
//                 ? "View Status"
//                 : "Register Your Restaurant"}
//             </button>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partner;




// import "./Partner.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Partner = () => {
//   const navigate = useNavigate();

//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     let email = null;
//     try {
//       email = JSON.parse(atob(token.split(".")[1])).sub;
//     } catch {
//       setLoading(false);
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     async function loadRestaurant() {
//       try {
//         // Priority does NOT matter anymore
//         const endpoints = [
//           `/partner/${email}`,
//           `/owner/${email}`,
//           `/public/live/${email}`,
//         ];

//         for (const ep of endpoints) {
//           try {
//             const res = await axios.get(
//               `http://localhost:9092/restaurant-api${ep}`,
//               { headers }
//             );

//             if (Array.isArray(res.data) && res.data.length > 0) {
//               setRestaurant(res.data[0]);
//               return;
//             }
//           } catch {
//             // ignore & continue
//           }
//         }

//         // No restaurant found
//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadRestaurant();
//   }, []);

//   if (loading) return null;

//   /* ================= STATUS FLAGS ================= */
//   const status = restaurant?.status;

//   const permanentlyBlocked = status === "PERMANENTLY_BLOCKED";
//   const rejected = status === "REJECTED";
//   const onHold = status === "ON_HOLD";
//   const suspended = status === "SUSPENDED";
//   const pending = status === "PENDING";
//   const approved = status === "APPROVED";
//   const isLive = approved && restaurant?.active === true;

//   /* ================= ENTRY NAVIGATION ================= */
//   const handleAction = () => {
//     if (permanentlyBlocked) return;

//     // 🚀 Only ONE condition opens dashboard
//     if (isLive) {
//       navigate("/restaurant-dashboard");
//       return;
//     }

//     // 🔎 Any registered but not-live state goes to status page
//     if (restaurant) {
//       navigate("/partner");
//       return;
//     }

//     // 🆕 No restaurant yet
//     navigate("/Register-form");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="partner-hero">
//       <div className="partner-inner">
//         <div className="partner-overlay">

//           {/* ====== HEADING ====== */}
//           <h1>
//             {permanentlyBlocked ? (
//               <>Account <span>Blocked</span></>
//             ) : restaurant ? (
//               <>Your Restaurant on <span>Foodie</span></>
//             ) : (
//               <>
//                 Partner with <span>Foodie</span><br />
//                 and grow your business
//               </>
//             )}
//           </h1>

//           {/* ====== STATUS HINT ====== */}
//           {permanentlyBlocked ? (
//             <div className="partner-status-card danger">
//               You are permanently blocked from operating restaurants on Foodie.
//             </div>
//           ) : rejected ? (
//             <div className="partner-status-card">
//               Your previous application was rejected.
//             </div>
//           ) : suspended ? (
//             <div className="partner-status-card">
//               Your restaurant is currently suspended.
//             </div>
//           ) : onHold ? (
//             <div className="partner-status-card">
//               Action required on your application.
//             </div>
//           ) : pending ? (
//             <div className="partner-status-card">
//               Your application is under verification.
//             </div>
//           ) : approved && !isLive ? (
//             <div className="partner-status-card">
//               Your restaurant is approved. Go live to start receiving orders.
//             </div>
//           ) : restaurant ? (
//             <div className="partner-status-card success">
//               Your restaurant is live on Foodie.
//             </div>
//           ) : (
//             <div className="offer-pill">
//               <strong>0% commission for the first month</strong>
//             </div>
//           )}

//           {/* ====== ACTION BUTTON ====== */}
//           {!permanentlyBlocked && (
//             <button className="partner-btn" onClick={handleAction}>
//               {isLive
//                 ? "Open Restaurant Dashboard"
//                 : restaurant
//                 ? "View Status"
//                 : "Register Your Restaurant"}
//             </button>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partner;


// import "./Partner.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Partner = () => {
//   const navigate = useNavigate();

//   const [restaurant, setRestaurant] = useState(null);
//   const [roles, setRoles] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const email = payload.sub;
//       const extractedRoles = payload.roles || [];
//       setRoles(extractedRoles);

//       const headers = { Authorization: `Bearer ${token}` };

//       async function loadRestaurant() {
//         try {
//           const endpoints = [
//             `/partner/${email}`,
//             `/owner/${email}`,
//             `/public/live/${email}`,
//           ];

//           for (const ep of endpoints) {
//             try {
//               const res = await axios.get(
//                 `http://localhost:9092/restaurant-api${ep}`,
//                 { headers }
//               );
//               if (res.data.length) {
//                 setRestaurant(res.data[0]);
//                 return;
//               }
//             } catch {}
//           }

//           setRestaurant(null);
//         } finally {
//           setLoading(false);
//         }
//       }

//       loadRestaurant();
//     } catch {
//       setLoading(false);
//     }
//   }, []);

//   if (loading) return null;

//   /* ================= ROLE & STATUS ================= */
//   const isOwner = roles.includes("RESTAURANT_OWNER");

//   const status = restaurant?.status;

//   const permanentlyBlocked = status === "PERMANENTLY_BLOCKED";
//   const rejected = status === "REJECTED";
//   const onHold = status === "ON_HOLD";
//   const suspended = status === "SUSPENDED";
//   const pending = status === "PENDING";

//   /* ================= ENTRY NAVIGATION ================= */
//   const handleAction = () => {
//     if (permanentlyBlocked) return;

//     if (isOwner) {
//       navigate("/restaurant-dashboard");
//       return;
//     }

//     if (pending || onHold || suspended) {
//       navigate("/partner");
//       return;
//     }

//     if (rejected) {
//       navigate("/Register-form");
//       return;
//     }

//     // Not registered yet
//     navigate("/Register-form");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="partner-hero">
//       <div className="partner-inner">
//         <div className="partner-overlay">

//           {/* ====== HEADING ====== */}
//           <h1>
//             {permanentlyBlocked ? (
//               <>Account <span>Blocked</span></>
//             ) : isOwner ? (
//               <>Your Restaurant on <span>Foodie</span></>
//             ) : (
//               <>
//                 Partner with <span>Foodie</span><br />
//                 and grow your business
//               </>
//             )}
//           </h1>

//           {/* ====== STATUS HINT (HIGH LEVEL ONLY) ====== */}
//           {permanentlyBlocked ? (
//             <div className="partner-status-card danger">
//               You are permanently blocked from operating restaurants on Foodie.
//             </div>
//           ) : rejected ? (
//             <div className="partner-status-card">
//               Your previous application was rejected.
//             </div>
//           ) : suspended ? (
//             <div className="partner-status-card">
//               Your restaurant is currently suspended.
//             </div>
//           ) : onHold ? (
//             <div className="partner-status-card">
//               Action required on your application.
//             </div>
//           ) : pending ? (
//             <div className="partner-status-card">
//               Your application is under verification.
//             </div>
//           ) : restaurant ? (
//             <div className="partner-status-card">
//               Your restaurant is registered on Foodie.
//             </div>
//           ) : (
//             <div className="offer-pill">
//               <strong>0% commission for the first month</strong>
//             </div>
//           )}

//           {/* ====== ACTION BUTTON ====== */}
//           {!permanentlyBlocked && (
//             <button className="partner-btn" onClick={handleAction}>
//               {isOwner
//                 ? "Open Restaurant Dashboard"
//                 : pending || onHold || suspended
//                 ? "View Status"
//                 : rejected
//                 ? "Register Again"
//                 : "Register Your Restaurant"}
//             </button>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partner;



// import "./Partner.css";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// const Partner = () => {
//   const navigate = useNavigate();

//   const [roles, setRoles] = useState([]);
//   const [tokenReady, setTokenReady] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       setRoles([]);
//       setTokenReady(true);
//       return;
//     }

//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       const extractedRoles = Array.isArray(payload.roles) ? payload.roles : [];
//       setRoles(extractedRoles);
//     } catch (e) {
//       console.error("Invalid token", e);
//       setRoles([]);
//     }

//     setTokenReady(true);
//   }, []);

//   // Prevent UI flicker before token loads
//   if (!tokenReady) return null;

//   const isPartner = roles.includes("RESTAURANT_PARTNER");
//   const isOwner = roles.includes("RESTAURANT_OWNER");

//   return (
//     <div className="partner-hero">
//       <div className="partner-inner">
//         <div className="partner-overlay">

//           {/* ================= HEADING ================= */}
//           <h1>
//             {isOwner ? (
//               <>Your Restaurant on <span>Foodie</span></>
//             ) : isPartner ? (
//               <>Your restaurant is under verification</>
//             ) : (
//               <>
//                 Partner with <span>Foodie</span> <br />
//                 and grow your business
//               </>
//             )}
//           </h1>

//           {/* ================= STATUS / OFFER ================= */}
//           {isPartner && !isOwner ? (
//             <div className="partner-status-card">
//               <div className="status-title">Application received</div>
//               <div className="status-text">
//                 We have received your restaurant details. Our onboarding team is
//                 currently reviewing your documents and menu. This process
//                 typically takes up to <b>3 business hours</b>. You will be
//                 notified by email once your restaurant is approved.
//               </div>
//               <div className="partner-status-meta">
//                 Need help? Our partner support team is available 24/7.
//               </div>
//             </div>
//           ) : isOwner ? (
//             <div className="partner-status-card">
//               <div className="status-title">Restaurant live</div>
//               <div className="status-text">
//                 Your restaurant is approved and live on Foodie. You can now
//                 manage orders, menu and payouts from your dashboard.
//               </div>
//             </div>
//           ) : (
//             <div className="offer-pill">
//               <span className="offer-icon">%</span>
//               <div>
//                 <strong>0% commission for your first month</strong>
//                 <p>Valid for new restaurant partners</p>
//               </div>
//             </div>
//           )}

//           {/* ================= BUTTON ================= */}
//           <button
//             className="partner-btn"
//             onClick={() => navigate("/partner-register")}
//           >
//             {isOwner
//               ? "Open Restaurant Dashboard"
//               : isPartner
//               ? "View Verification Status"
//               : "Register your restaurant"}
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Partner;
