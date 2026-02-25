import { useEffect, useState } from "react";
import "./PartnerStatus.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PartnerStatus() {
  const navigate = useNavigate();

  const [restaurant, setRestaurant] = useState(null);
  const [audit, setAudit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [permanentlyBlocked, setPermanentlyBlocked] = useState(false);

  /* ================= LOAD RESTAURANT ================= */
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

        setRestaurant(res.data || null);
      } catch (err) {
        // 🚫 Permanently blocked user
        if (err.response?.status === 403) {
          setPermanentlyBlocked(true);
        }
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    }

    loadRestaurant();
  }, []);

  /* ================= LOAD KYC REASON ================= */
  useEffect(() => {
    if (!restaurant) return;

    const reasonStatuses = [
      "ON_HOLD",
      "REJECTED",
      "SUSPENDED",
      "PERMANENTLY_BLOCKED",
    ];

    if (!reasonStatuses.includes(restaurant.status)) return;

    const token = localStorage.getItem("token");

    axios
      .get(
        `http://localhost:9092/restaurant-api/partner/kyc/reason/${restaurant.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => setAudit(res.data))
      .catch(() => setAudit(null));
  }, [restaurant]);

  /* ================= AUTO REDIRECT (LIVE) ================= */
  useEffect(() => {
    if (restaurant?.status === "APPROVED" && restaurant.active) {
      const timer = setTimeout(
        () => navigate("/restaurant-dashboard"),
        1200
      );
      return () => clearTimeout(timer);
    }
  }, [restaurant, navigate]);

  if (loading) {
    return <div className="partner-loading">Loading...</div>;
  }

  const status = restaurant?.status;

  const canEdit =
    status === "ON_HOLD" ||
    status === "REJECTED" ||
    status === "SUSPENDED";

  /* ================= UI ================= */
  return (
    <div className="partner-page">
      <div className="partner-hero-full">
        <div className="partner-hero-overlay">

          {/* 🚫 PERMANENTLY BLOCKED */}
          {permanentlyBlocked && (
            <>
              <h1>Account Permanently Blocked</h1>
              <div className="hold-box danger">
                <p>{audit?.reason || "Violation of platform policies"}</p>
              </div>
              <p>
                This decision is final. You are no longer eligible to operate
                restaurants on Foodie.
              </p>
            </>
          )}

          {/* ❌ NO RESTAURANT */}
          {!permanentlyBlocked && !restaurant && (
            <>
              <h1>Become a Foodie Partner</h1>
              <p>You have not registered any restaurant yet.</p>
              <button
                className="partner-btn"
                onClick={() => navigate("/Register-form")}
              >
                Register Restaurant
              </button>
            </>
          )}

          {/* ⏳ PENDING */}
          {status === "PENDING" && (
            <>
              <h1>Under Verification</h1>
              <p>
                Your documents are under review.
                This usually takes up to <b>3 working days</b>.
              </p>
              <p>You will be notified once verification is complete.</p>
            </>
          )}

          {/* ⚠️ ON HOLD / ❌ REJECTED / ⏸ SUSPENDED */}
          {(status === "ON_HOLD" ||
            status === "REJECTED" ||
            status === "SUSPENDED") && (
            <>
              <h1>{status.replace("_", " ")}</h1>
              <div className="hold-box">
                <p>{audit?.reason || "No reason provided"}</p>
              </div>

              {canEdit && (
                <button
                  className="partner-btn"
                  onClick={() => navigate("/Register-form?edit=true")}
                >
                  Fix & Update Documents
                </button>
              )}
            </>
          )}

          {/* ✅ APPROVED BUT NOT LIVE */}
          {status === "APPROVED" && !restaurant.active && (
            <>
              <h1>Approved 🎉</h1>
              <p>Your restaurant is approved.</p>
              <p>Please go live to start receiving orders.</p>

              <button
                className="partner-btn"
                onClick={() => navigate("/restaurant-dashboard")}
              >
                Go Live
              </button>
            </>
          )}

          {/* 🟢 LIVE */}
          {status === "APPROVED" && restaurant.active && (
            <>
              <h1>Your Restaurant is Live 🚀</h1>
              <p>Redirecting to dashboard...</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
}


// import { useEffect, useState } from "react";
// import "./PartnerStatus.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function getEmailFromToken(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// }

// export default function PartnerStatus() {
//   const navigate = useNavigate();

//   const [restaurant, setRestaurant] = useState(null);
//   const [audit, setAudit] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD RESTAURANT ================= */
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     const email = getEmailFromToken(token);
//     if (!email) {
//       setLoading(false);
//       return;
//     }

//     const headers = { Authorization: `Bearer ${token}` };

//     async function load() {
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
//             // ignore & continue
//           }
//         }

//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   /* ================= LOAD AUDIT REASON ================= */
//   useEffect(() => {
//     if (!restaurant) return;

//     const reasonStatuses = [
//       "ON_HOLD",
//       "REJECTED",
//       "SUSPENDED",
//       "PERMANENTLY_BLOCKED",
//     ];

//     if (!reasonStatuses.includes(restaurant.status)) return;

//     const token = localStorage.getItem("token");

//     axios
//       .get(
//         `http://localhost:9092/restaurant-api/partner/kyc/reason/${restaurant.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(res => setAudit(res.data))
//       .catch(() => setAudit(null));
//   }, [restaurant]);

//   /* ================= AUTO REDIRECT (LIVE ONLY) ================= */
//   useEffect(() => {
//     if (restaurant?.status === "APPROVED" && restaurant.active) {
//       const timer = setTimeout(
//         () => navigate("/restaurant-dashboard"),
//         1200
//       );
//       return () => clearTimeout(timer);
//     }
//   }, [restaurant, navigate]);

//   if (loading) return <div className="partner-loading">Loading...</div>;

//   /* ================= STATE FLAGS ================= */
//   const status = restaurant?.status;

//   const canEdit =
//     status === "ON_HOLD" ||
//     status === "REJECTED" ||
//     status === "SUSPENDED";

//   const permanentlyBlocked = status === "PERMANENTLY_BLOCKED";

//   /* ================= UI ================= */
//   return (
//     <div className="partner-page">
//       <div className="partner-hero-full">
//         <div className="partner-hero-overlay">

//           {/* NO RESTAURANT */}
//           {!restaurant && (
//             <>
//               <h1>Become a Foodie Partner</h1>
//               <p>You have not registered any restaurant yet.</p>
//               <button
//                 className="partner-btn"
//                 onClick={() => navigate("/Register-form")}
//               >
//                 Register Restaurant
//               </button>
//             </>
//           )}

//           {/* PENDING */}
//           {status === "PENDING" && (
//             <>
//               <h1>Under Verification</h1>
//               <p>
//                 Your documents are under review.
//                 This usually takes up to <b>3 working days</b>.
//               </p>
//               <p>You will be notified once verification is complete.</p>
//             </>
//           )}

//           {/* ON HOLD / REJECTED / SUSPENDED */}
//           {(status === "ON_HOLD" ||
//             status === "REJECTED" ||
//             status === "SUSPENDED") && (
//             <>
//               <h1>{status.replace("_", " ")}</h1>
//               <div className="hold-box">
//                 <p>{audit?.reason || "No reason provided"}</p>
//               </div>

//               {canEdit && (
//                 <button
//                   className="partner-btn"
//                   onClick={() => navigate("/Register-form?edit=true")}
//                 >
//                   Fix & Update Documents
//                 </button>
//               )}
//             </>
//           )}

//           {/* APPROVED BUT NOT LIVE */}
//           {status === "APPROVED" && !restaurant.active && (
//             <>
//               <h1>Approved 🎉</h1>
//               <p>Your restaurant is approved.</p>
//               <p>Please go live to start receiving orders.</p>

//               <button
//                 className="partner-btn"
//                 onClick={() => navigate("/restaurant-dashboard")}
//               >
//                 Go Live
//               </button>
//             </>
//           )}

//           {/* LIVE */}
//           {restaurant?.status === "APPROVED" && restaurant.active && (
//             <>
//               <h1>Your Restaurant is Live 🚀</h1>
//               <p>Redirecting to dashboard...</p>
//             </>
//           )}

//           {/* PERMANENTLY BLOCKED */}
//           {permanentlyBlocked && (
//             <>
//               <h1>Account Permanently Blocked</h1>
//               <div className="hold-box danger">
//                 <p>{audit?.reason}</p>
//               </div>
//               <p>
//                 This decision is final. You are no longer eligible to
//                 operate restaurants on Foodie.
//               </p>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import "./PartnerStatus.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// function getEmailFromToken(token) {
//   try {
//     return JSON.parse(atob(token.split(".")[1])).sub;
//   } catch {
//     return null;
//   }
// }

// export default function PartnerStatus() {
//   const navigate = useNavigate();

//   const [restaurant, setRestaurant] = useState(null);
//   const [audit, setAudit] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) return setLoading(false);

//     const email = getEmailFromToken(token);
//     const headers = { Authorization: `Bearer ${token}` };

//     async function load() {
//       try {
//         const endpoints = [
//           `/partner/${email}`,
//           `/owner/${email}`,
//           `/public/live/${email}`
//         ];

//         for (const ep of endpoints) {
//           try {
//             const res = await axios.get(
//               `http://localhost:9092/restaurant-api${ep}`,
//               { headers }
//             );
//             if (res.data.length) {
//               setRestaurant(res.data[0]);
//               return;
//             }
//           } catch {}
//         }

//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     load();
//   }, []);

//   useEffect(() => {
//     if (!restaurant) return;

//     const reasonStatuses = [
//       "ON_HOLD",
//       "REJECTED",
//       "SUSPENDED",
//       "PERMANENTLY_BLOCKED"
//     ];

//     if (!reasonStatuses.includes(restaurant.status)) return;

//     const token = localStorage.getItem("token");

//     axios
//       .get(
//         `http://localhost:9092/restaurant-api/partner/kyc/reason/${restaurant.id}`,
//         { headers: { Authorization: `Bearer ${token}` } }
//       )
//       .then(res => setAudit(res.data))
//       .catch(() => setAudit(null));
//   }, [restaurant]);

//   if (loading) return <div className="partner-loading">Loading...</div>;

//   /* ================= STATE FLAGS ================= */
//   const status = restaurant?.status;

//   const canEdit =
//     status === "ON_HOLD" ||
//     status === "REJECTED" ||
//     status === "SUSPENDED";

//   const permanentlyBlocked = status === "PERMANENTLY_BLOCKED";

//   /* ================= UI ================= */
//   return (
//     <div className="partner-page">
//       <div className="partner-hero-full">
//         <div className="partner-hero-overlay">

//           {/* NO RESTAURANT */}
//           {!restaurant && (
//             <>
//               <h1>Become a Foodie Partner</h1>
//               <p>You have not registered any restaurant yet.</p>
//               <button
//                 className="partner-btn"
//                 onClick={() => navigate("/Register-form")}
//               >
//                 Register Restaurant
//               </button>
//             </>
//           )}

//           {/* PENDING */}
//           {status === "PENDING" && (
//             <>
//               <h1>Under Verification</h1>
//               <p>
//                 Your documents are under review.  
//                 This usually takes up to <b>3 working days</b>.
//               </p>
//               <p>You will be notified once verification is complete.</p>
//             </>
//           )}

//           {/* ON HOLD / SUSPENDED / REJECTED */}
//           {(status === "ON_HOLD" ||
//             status === "REJECTED" ||
//             status === "SUSPENDED") && (
//             <>
//               <h1>{status.replace("_", " ")}</h1>
//               <div className="hold-box">
//                 <p>{audit?.reason || "No reason provided"}</p>
//               </div>

//               {canEdit && (
//                 <button
//                   className="partner-btn"
//                   onClick={() => navigate("/Register-form?edit=true")}
//                 >
//                   Fix & Update Documents
//                 </button>
//               )}
//             </>
//           )}

//           {/* APPROVED */}
//           {status === "APPROVED" && !restaurant.active && (
//             <>
//               <h1>Approved 🎉</h1>
//               <p>Your restaurant is approved. You can now go live.</p>
//               <button
//                 className="partner-btn"
//                 onClick={() => navigate("/restaurant-dashboard")}
//               >
//                 Open Dashboard
//               </button>
//             </>
//           )}

//           {/* LIVE */}
//           {restaurant?.active && (
//             <>
//               <h1>Your Restaurant is Live 🚀</h1>
//               <p>Redirecting to dashboard...</p>
//               {setTimeout(
//                 () => navigate("/restaurant-dashboard"),
//                 1200
//               )}
//             </>
//           )}

//           {/* PERMANENTLY BLOCKED */}
//           {permanentlyBlocked && (
//             <>
//               <h1>Account Permanently Blocked</h1>
//               <div className="hold-box danger">
//                 <p>{audit?.reason}</p>
//               </div>
//               <p>
//                 This decision is final. You are no longer eligible to
//                 operate restaurants on Foodie.
//               </p>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import "./PartnerRegister.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// /* 🔥 ADD THIS FUNCTION */
// function getEmailFromToken(token) {
//   try {
//     const payload = token.split(".")[1];
//     const decoded = JSON.parse(atob(payload));
//     return decoded.sub;
//   } catch (e) {
//     return null;
//   }
// }

// export default function PartnerRegister() {
//   const navigate = useNavigate();
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [audit, setAudit] = useState(null);

//   const [submitted, setSubmitted] = useState(
//     localStorage.getItem("partnerSubmitted") === "true"
//   );

//   const [role] = useState(localStorage.getItem("role"));

//   /* ================= LOAD STATUS ================= */

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     let payload = null;
//     try {
//       payload = JSON.parse(atob(token.split(".")[1]));
//     } catch {
//       setLoading(false);
//       return;
//     }

//     const roles = payload.roles || [];
//     const isPartner = roles.includes("RESTAURANT_PARTNER");
//     const isOwner = roles.includes("RESTAURANT_OWNER");

//     const email = payload.sub;
//     const headers = { Authorization: `Bearer ${token}` };

//     async function loadStatus() {
//       try {
//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/partner/${email}`,
//             { headers }
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/owner/${email}`,
//             { headers }
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/public/live/${email}`
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         // nothing found
//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadStatus();
//   }, []);

//   /* ================= LOAD ADMIN REASON (SAFE) ================= */

//   useEffect(() => {
//     if (!restaurant) return;

//     const token = localStorage.getItem("token");
//     const headers = { Authorization: `Bearer ${token}` };

//     axios
//       .get(
//         `http://localhost:9092/restaurant-api/partner/kyc/reason/${restaurant.id}`,
//         { headers }
//       )
//       .then((res) => setAudit(res.data))
//       .catch(() => setAudit(null));
//   }, [restaurant]);

//   /* ================= AUTO REDIRECT WHEN LIVE ================= */
//   useEffect(() => {
//     if (restaurant && restaurant.active === true) {
//       setTimeout(() => navigate("/restaurant-dashboard"), 1200);
//     }
//   }, [restaurant]);

//   if (loading) return <div className="partner-loading">Loading…</div>;

//   return (
//     <div className="partner-page">
//       <div className="partner-hero-full">
//         <div className="partner-hero-overlay">

// {/* ================= KYC PROGRESS ================= */}
// {restaurant && (
//   <div className="kyc-progress">
//     <span className={restaurant.status !== "PENDING" ? "done" : "active"}>Submitted</span>
//     <span className={["APPROVED","SUSPENDED","REJECTED","PERMANENTLY_BLOCKED"].includes(restaurant.status) ? "done" : "active"}>Verified</span>
//     <span className={restaurant.active ? "done" : "active"}>Live</span>
//   </div>
// )}

// {/* ================= STATE MACHINE ================= */}

// {/* USER ONLY */}
// {!restaurant && !submitted && (
//   <>
//     <h1>Partner with Foodie</h1>
//     <p>Join India’s fastest growing food delivery network</p>
//     <button className="partner-btn" onClick={() => navigate("/Register-form")}>
//       Register Your Restaurant
//     </button>
//   </>
// )}

// {/* SUBMITTED */}
// {!restaurant && submitted && (
//   <>
//     <h1>Thank you for registering</h1>
//     <p>Your documents are being verified.</p>
//   </>
// )}

// {/* PENDING */}
// {restaurant && restaurant.status === "PENDING" && (
//   <>
//     <h1>Under Review</h1>
//     <p>Your KYC is being verified.</p>
//   </>
// )}

// {/* ON HOLD */}
// {restaurant && restaurant.status === "ON_HOLD" && (
//   <>
//     <h1>Action Required</h1>
//     <div className="hold-box">
//       <strong>Admin Note</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <button className="partner-btn" onClick={() => navigate("/Register-form?edit=true")}>
//       Fix & Resubmit
//     </button>
//   </>
// )}

// {/* REJECTED (re-apply allowed) */}
// {restaurant && restaurant.status === "REJECTED" && (
//   <>
//     <h1>Rejected</h1>
//     <div className="hold-box">
//       <strong>Reason</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <button className="partner-btn" onClick={() => navigate("/Register-form")}>
//       Register Again
//     </button>
//   </>
// )}

// {/* PERMANENTLY BLOCKED (NO RE-APPLY) */}
// {restaurant && restaurant.status === "PERMANENTLY_BLOCKED" && (
//   <>
//     <h1>Account Permanently Blocked</h1>
//     <div className="hold-box">
//       <strong>Compliance Decision</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <p>
//       You are permanently restricted from running restaurants on Foodie.  
//       This decision is final.
//     </p>
//   </>
// )}

// {/* APPROVED */}
// {restaurant && restaurant.status === "APPROVED" && !restaurant.active && (
//   <>
//     <h1>Approved 🎉</h1>
//     <p>Configure your restaurant to go live.</p>
//     <button className="partner-btn" onClick={() => navigate("/restaurant-dashboard")}>
//       Configure Restaurant
//     </button>
//   </>
// )}

// {/* LIVE */}
// {restaurant && restaurant.active === true && (
//   <>
//     <h1>Your restaurant is live 🚀</h1>
//     <p>Redirecting to dashboard…</p>
//   </>
// )}

// {/* SUSPENDED */}
// {restaurant && restaurant.status === "SUSPENDED" && (
//   <>
//     <h1>Restaurant Suspended</h1>
//     <div className="hold-box">
//       <strong>Compliance Reason</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <p>Please contact Foodie Support.</p>
//   </>
// )}

//         </div>
//       </div>
//     </div>
//   );
// }

// import { useEffect, useState } from "react";
// import "./PartnerRegister.css";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// /* 🔥 ADD THIS FUNCTION */
// function getEmailFromToken(token) {
//   try {
//     const payload = token.split(".")[1];
//     const decoded = JSON.parse(atob(payload));
//     return decoded.sub;
//   } catch (e) {
//     return null;
//   }
// }

// export default function PartnerRegister() {
//   const navigate = useNavigate();
//   const [restaurant, setRestaurant] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [audit, setAudit] = useState(null);

//   const [submitted, setSubmitted] = useState(
//     localStorage.getItem("partnerSubmitted") === "true"
//   );

//   const [role] = useState(localStorage.getItem("role"));

//   /* ================= LOAD STATUS ================= */

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     let payload = null;
//     try {
//       payload = JSON.parse(atob(token.split(".")[1]));
//     } catch {
//       setLoading(false);
//       return;
//     }

//     const roles = payload.roles || [];
//     const isPartner = roles.includes("RESTAURANT_PARTNER");
//     const isOwner = roles.includes("RESTAURANT_OWNER");

//     if (!isPartner && !isOwner) {
//       setRestaurant(null);
//       setLoading(false);
//       return;
//     }

//     const email = payload.sub;
//     const headers = { Authorization: `Bearer ${token}` };

//     async function loadStatus() {
//       try {
//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/partner/${email}`,
//             { headers }
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/owner/${email}`,
//             { headers }
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         try {
//           const res = await axios.get(
//             `http://localhost:9092/restaurant-api/public/live/${email}`
//           );
//           if (res.data.length > 0) {
//             setRestaurant(res.data[0]);
//             return;
//           }
//         } catch {}

//         setRestaurant(null);
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadStatus();
//   }, []);

//   /* ================= LOAD ADMIN REASON (SAFE) ================= */

//   useEffect(() => {
//     if (!restaurant) return;

//     const token = localStorage.getItem("token");
//     const headers = { Authorization: `Bearer ${token}` };

//     axios
//       .get(
//         `http://localhost:9092/restaurant-api/partner/kyc/reason/${restaurant.id}`,
//         { headers }
//       )
//       .then((res) => setAudit(res.data))
//       .catch(() => setAudit(null));
//   }, [restaurant]);

//   /* ================= AUTO REDIRECT WHEN LIVE ================= */
//   useEffect(() => {
//     if (restaurant && restaurant.active === true) {
//       setTimeout(() => navigate("/restaurant-dashboard"), 1200);
//     }
//   }, [restaurant]);

//   if (loading) return <div className="partner-loading">Loading…</div>;

//   return (
//     <div className="partner-page">
//       <div className="partner-hero-full">
//         <div className="partner-hero-overlay">

// {/* ================= KYC PROGRESS ================= */}
// {restaurant && (
//   <div className="kyc-progress">
//     <span className={restaurant.status !== "PENDING" ? "done" : "active"}>Submitted</span>
//     <span className={["APPROVED","SUSPENDED","REJECTED"].includes(restaurant.status) ? "done" : "active"}>Verified</span>
//     <span className={restaurant.active ? "done" : "active"}>Live</span>
//   </div>
// )}

// {/* ================= STATE MACHINE ================= */}

// {!restaurant && !submitted && (
//   <>
//     <h1>Partner with Foodie</h1>
//     <p>Join India’s fastest growing food delivery network</p>
//     <button className="partner-btn" onClick={() => navigate("/Register-form")}>
//       Register Your Restaurant
//     </button>
//   </>
// )}

// {!restaurant && submitted && (
//   <>
//     <h1>Thank you for registering</h1>
//     <p>Your documents are being verified.</p>
//   </>
// )}

// {restaurant && restaurant.status === "PENDING" && (
//   <>
//     <h1>Under Review</h1>
//     <p>Your KYC is being verified.</p>
//   </>
// )}

// {restaurant && restaurant.status === "ON_HOLD" && (
//   <>
//     <h1>Action Required</h1>
//     <div className="hold-box">
//       <strong>Admin Note</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <button className="partner-btn" onClick={() => navigate("/Register-form?edit=true")}>
//       Fix & Resubmit
//     </button>
//   </>
// )}

// {restaurant && restaurant.status === "REJECTED" && (
//   <>
//     <h1>Rejected</h1>
//     <div className="hold-box">
//       <strong>Reason</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <button className="partner-btn" onClick={() => navigate("/Register-form")}>
//       Register Again
//     </button>
//   </>
// )}

// {restaurant && restaurant.status === "APPROVED" && !restaurant.active && (
//   <>
//     <h1>Approved 🎉</h1>
//     <p>Configure your restaurant to go live.</p>
//     <button className="partner-btn" onClick={() => navigate("/restaurant-dashboard")}>
//       Configure Restaurant
//     </button>
//   </>
// )}

// {restaurant && restaurant.active === true && (
//   <>
//     <h1>Your restaurant is live 🚀</h1>
//     <p>Redirecting to dashboard…</p>
//   </>
// )}

// {restaurant && restaurant.status === "SUSPENDED" && (
//   <>
//     <h1>Restaurant Suspended</h1>
//     <div className="hold-box">
//       <strong>Compliance Reason</strong>
//       <p>{audit?.reason}</p>
//     </div>
//     <p>Please contact Foodie Support.</p>
//   </>
// )}

//         </div>
//       </div>
//     </div>
//   );
// }
