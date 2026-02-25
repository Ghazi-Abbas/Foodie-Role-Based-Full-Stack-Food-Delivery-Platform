import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { toast, ToastContainer } from "react-toastify";
import "./KycDetails.css";
import {
  getKycDetails,
  approveKyc,
  rejectKyc,
  holdKyc,
  suspendKyc,
  reinstateRestaurant,
  permanentlyBlockRestaurant
} from "../services/AdminService";

export default function KycDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [reason, setReason] = useState("");

  const load = () => {
    getKycDetails(id).then(res => {
      setData(res.data);
      setReason("");
    });
  };

  useEffect(() => {
    load();
  }, [id]);

  if (!data) return <p>Loading…</p>;

  const { restaurant, bankDetails } = data;
  const status = restaurant.status;

  // ✅ helper for reason validation
  const validateReason = (msg) => {
    if (!reason.trim()) {
      toast.error(msg);
      return false;
    }
    return true;
  };

  return (
    <div className="kyc-page">
      <div className="kyc-container">

        {/* HEADER */}
        <div className="kyc-header">
          <div>
            <h2>{restaurant.restaurantName}</h2>
            <p className="kyc-sub">
              {restaurant.ownerEmail} • {restaurant.city} • {restaurant.phone}
            </p>
          </div>
          <div className={`status-badge ${status.toLowerCase()}`}>
            {status}
          </div>
        </div>

        {/* CONTENT */}
        <div className="kyc-layout">
          <div className="kyc-card">
            <div className="kyc-grid">
              <div><b>ADDRESS</b>{restaurant.address}</div>
              <div><b>CITY</b>{restaurant.city}</div>
              <div><b>PAN</b>{restaurant.panCard}</div>
              <div><b>ACCOUNT HOLDER</b>{bankDetails?.accountHolderName}</div>
              <div><b>FSSAI</b>{restaurant.fssaiLicence}</div>
              <div><b>ACCOUNT</b>{bankDetails?.accountNumber}</div>
              <div><b>IFSC</b>{bankDetails?.ifscCode}</div>
              <div><b>BRANCH</b>{bankDetails?.branchAddress}</div>
            </div>
          </div>

          <div className="kyc-card">
            <img src={restaurant.restaurantImageUrl} alt="Restaurant" />
          </div>
        </div>

        {/* ================= ACTION PANEL ================= */}
        <div className="kyc-actions">

          {/* -------- PENDING -------- */}
          {status === "PENDING" && (
            <>
              <button
                className="approve"
                onClick={() =>
                  approveKyc(id).then(() => {
                    toast.success("KYC approved successfully");
                    load();
                  })
                }
              >
                Approve
              </button>

              <button
                className="hold"
                onClick={() =>
                  holdKyc(id, "Needs verification").then(() => {
                    toast.info("KYC put on hold");
                    load();
                  })
                }
              >
                Put On Hold
              </button>

              <textarea
                placeholder="Rejection reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <button
                className="reject"
                onClick={() => {
                  if (!validateReason("Rejection reason required")) return;
                  rejectKyc(id, reason).then(() => {
                    toast.success("KYC rejected");
                    load();
                  });
                }}
              >
                Reject
              </button>

              <button
                className="block"
                onClick={() => {
                  if (!validateReason("Block reason required")) return;
                  permanentlyBlockRestaurant(id, reason).then(() => {
                    toast.error("Restaurant permanently blocked");
                    load();
                  });
                }}
              >
                Permanently Block
              </button>
            </>
          )}

          {/* -------- ON HOLD -------- */}
          {status === "ON_HOLD" && (
            <>
              <button
                className="approve"
                onClick={() =>
                  approveKyc(id).then(() => {
                    toast.success("Approved after review");
                    load();
                  })
                }
              >
                Approve After Review
              </button>

              <textarea
                placeholder="Rejection / Block reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <button
                className="reject"
                onClick={() => {
                  if (!validateReason("Rejection reason required")) return;
                  rejectKyc(id, reason).then(() => {
                    toast.success("KYC rejected");
                    load();
                  });
                }}
              >
                Reject
              </button>

              <button
                className="block"
                onClick={() => {
                  if (!validateReason("Block reason required")) return;
                  permanentlyBlockRestaurant(id, reason).then(() => {
                    toast.error("Restaurant permanently blocked");
                    load();
                  });
                }}
              >
                Permanently Block
              </button>
            </>
          )}

          {/* -------- APPROVED -------- */}
          {status === "APPROVED" && (
            <>
              <textarea
                placeholder="Suspension / Block reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <button
                className="suspend"
                onClick={() => {
                  if (!validateReason("Suspension reason required")) return;
                  suspendKyc(id, reason).then(() => {
                    toast.warning("Restaurant suspended");
                    load();
                  });
                }}
              >
                Suspend Restaurant
              </button>

              <button
                className="block"
                onClick={() => {
                  if (!validateReason("Block reason required")) return;
                  permanentlyBlockRestaurant(id, reason).then(() => {
                    toast.error("Restaurant permanently blocked");
                    load();
                  });
                }}
              >
                Permanently Block
              </button>
            </>
          )}

          {/* -------- SUSPENDED -------- */}
          {status === "SUSPENDED" && (
            <>
              <button
                className="approve"
                onClick={() =>
                  reinstateRestaurant(id).then(() => {
                    toast.success("Restaurant reinstated");
                    load();
                  })
                }
              >
                Reinstate
              </button>

              <textarea
                placeholder="Permanent block reason"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <button
                className="block"
                onClick={() => {
                  if (!validateReason("Block reason required")) return;
                  permanentlyBlockRestaurant(id, reason).then(() => {
                    toast.error("Restaurant permanently blocked");
                    load();
                  });
                }}
              >
                Permanently Block
              </button>
            </>
          )}

          {/* -------- PERMANENTLY BLOCKED -------- */}
          {status === "PERMANENTLY_BLOCKED" && (
            <div className="blocked-text">
              This restaurant is permanently blocked and cannot be modified.
            </div>
          )}

        </div>
      </div>
       {/* ✅ REQUIRED FOR TOASTS */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./KycDetails.css";
// import {
//   getKycDetails,
//   approveKyc,
//   rejectKyc,
//   holdKyc,
//   suspendKyc,
//   reinstateRestaurant,
//   permanentlyBlockRestaurant
// } from "../services/AdminService";

// export default function KycDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [reason, setReason] = useState("");

//   const load = () => {
//     getKycDetails(id).then(res => {
//       setData(res.data);
//       setReason("");
//     });
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   if (!data) return <p>Loading…</p>;

//   const { restaurant, bankDetails } = data;
//   const status = restaurant.status;

//   return (
//     <div className="kyc-page">
//       <div className="kyc-container">

//         {/* HEADER */}
//         <div className="kyc-header">
//           <div>
//             <h2>{restaurant.restaurantName}</h2>
//             <p className="kyc-sub">
//               {restaurant.ownerEmail} • {restaurant.city} • {restaurant.phone}
//             </p>
//           </div>
//           <div className={`status-badge ${status.toLowerCase()}`}>
//             {status}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="kyc-layout">
//           <div className="kyc-card">
//             <div className="kyc-grid">
//               <div><b>ADDRESS</b>{restaurant.address}</div>
//               <div><b>CITY</b>{restaurant.city}</div>
//               <div><b>PAN</b>{restaurant.panCard}</div>
//               <div><b>ACCOUNT HOLDER</b>{bankDetails?.accountHolderName}</div>
//               <div><b>FSSAI</b>{restaurant.fssaiLicence}</div>
//               <div><b>ACCOUNT</b>{bankDetails?.accountNumber}</div>
//               <div><b>IFSC</b>{bankDetails?.ifscCode}</div>
//               <div><b>BRANCH</b>{bankDetails?.branchAddress}</div>
//             </div>
//           </div>

//           <div className="kyc-card">
//             <img src={restaurant.restaurantImageUrl} alt="Restaurant" />
//           </div>
//         </div>

//         {/* ================= ACTION PANEL ================= */}
//         <div className="kyc-actions">

//           {/* -------- PENDING -------- */}
//           {status === "PENDING" && (
//             <>
//               <button className="approve" onClick={() => approveKyc(id).then(load)}>
//                 Approve
//               </button>

//               <button className="hold" onClick={() => holdKyc(id, "Needs verification").then(load)}>
//                 Put On Hold
//               </button>

//               <textarea
//                 placeholder="Rejection reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button
//                 className="reject"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Rejection reason required");
//                   rejectKyc(id, reason).then(load);
//                 }}
//               >
//                 Reject
//               </button>

//               <button
//                 className="block"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Block reason required");
//                   permanentlyBlockRestaurant(id, reason).then(load);
//                 }}
//               >
//                 Permanently Block
//               </button>
//             </>
//           )}

//           {/* -------- ON HOLD -------- */}
//           {status === "ON_HOLD" && (
//             <>
//               <button className="approve" onClick={() => approveKyc(id, "Approved after review").then(load)}>
//                 Approve After Review
//               </button>

//               <textarea
//                 placeholder="Rejection / Block reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button
//                 className="reject"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Rejection reason required");
//                   rejectKyc(id, reason).then(load);
//                 }}
//               >
//                 Reject
//               </button>

//               <button
//                 className="block"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Block reason required");
//                   permanentlyBlockRestaurant(id, reason).then(load);
//                 }}
//               >
//                 Permanently Block
//               </button>
//             </>
//           )}

//           {/* -------- APPROVED -------- */}
//           {status === "APPROVED" && (
//             <>
//               <textarea
//                 placeholder="Suspension / Block reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button
//                 className="suspend"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Suspension reason required");
//                   suspendKyc(id, reason).then(load);
//                 }}
//               >
//                 Suspend Restaurant
//               </button>

//               <button
//                 className="block"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Block reason required");
//                   permanentlyBlockRestaurant(id, reason).then(load);
//                 }}
//               >
//                 Permanently Block
//               </button>
//             </>
//           )}

//           {/* -------- SUSPENDED -------- */}
//           {status === "SUSPENDED" && (
//             <>
//               <button className="approve" onClick={() => reinstateRestaurant(id).then(load)}>
//                 Reinstate
//               </button>

//               <textarea
//                 placeholder="Permanent block reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button
//                 className="block"
//                 onClick={() => {
//                   if (!reason.trim()) return alert("Block reason required");
//                   permanentlyBlockRestaurant(id, reason).then(load);
//                 }}
//               >
//                 Permanently Block
//               </button>
//             </>
//           )}

//           {/* -------- PERMANENTLY BLOCKED -------- */}
//           {status === "PERMANENTLY_BLOCKED" && (
//             <div className="blocked-text">
//               This restaurant is permanently blocked and cannot be modified.
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }



// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./KycDetails.css";
// import {
//   getKycDetails,
//   approveKyc,
//   rejectKyc,
//   holdKyc,
//   suspendKyc,
//   reinstateRestaurant,
//   permanentlyBlockRestaurant
// } from "../services/AdminService";

// export default function KycDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   // 🔥 Separate admin reasons (enterprise safe)
//   const [approveReason, setApproveReason] = useState("");
//   const [holdReason, setHoldReason] = useState("");
//   const [rejectReason, setRejectReason] = useState("");
//   const [suspendReason, setSuspendReason] = useState("");
//   const [blockReason, setBlockReason] = useState("");

//   const load = async () => {
//     const res = await getKycDetails(id);
//     setData(res.data);

//     // Clear all admin inputs after reload
//     setApproveReason("");
//     setHoldReason("");
//     setRejectReason("");
//     setSuspendReason("");
//     setBlockReason("");
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   if (!data) return <p>Loading…</p>;

//   const { restaurant, bankDetails } = data;
//   const status = restaurant.status;

//   // ================= ACTION HANDLERS =================

//   const handleApprove = () =>
//     approveKyc(id, approveReason || "KYC Verified").then(load);

//   const handleApproveAfterReview = () =>
//     approveKyc(id, approveReason || "Approved after admin review").then(load);

//   const handleHold = () => {
//     if (!holdReason.trim()) return alert("Hold reason required");
//     holdKyc(id, holdReason).then(load);
//   };

//   const handleReject = () => {
//     if (!rejectReason.trim()) return alert("Rejection reason required");
//     rejectKyc(id, rejectReason).then(load);
//   };

//   const handleSuspend = () => {
//     if (!suspendReason.trim()) return alert("Suspension reason required");
//     suspendKyc(id, suspendReason).then(load);
//   };

//   const handleReinstate = () => {
//     reinstateRestaurant(id).then(load);
//   };

//   const handlePermanentBlock = () => {
//     if (!blockReason.trim()) return alert("Block reason required");
//     permanentlyBlockRestaurant(id, blockReason).then(load);
//   };

//   // ================= UI =================

//   return (
//     <div className="kyc-page">
//       <div className="kyc-container">

//         {/* HEADER */}
//         <div className="kyc-header">
//           <div>
//             <h2>{restaurant.restaurantName}</h2>
//             <p className="kyc-sub">
//               {restaurant.ownerEmail} • {restaurant.city} • {restaurant.phone}
//             </p>
//           </div>
//           <div className={`status-badge ${status.toLowerCase()}`}>
//             {status}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="kyc-layout">
//           <div className="kyc-card">
//             <div className="kyc-grid">
//               <div><b>ADDRESS</b>{restaurant.address}</div>
//               <div><b>CITY</b>{restaurant.city}</div>
//               <div><b>PAN</b>{restaurant.panCard}</div>
//               <div><b>ACCOUNT HOLDER</b>{bankDetails?.accountHolderName}</div>
//               <div><b>FSSAI</b>{restaurant.fssaiLicence}</div>
//               <div><b>ACCOUNT</b>{bankDetails?.accountNumber}</div>
//               <div><b>IFSC</b>{bankDetails?.ifscCode}</div>
//               <div><b>BRANCH</b>{bankDetails?.branchAddress}</div>
//             </div>
//           </div>

//           <div className="kyc-card">
//             <img src={restaurant.restaurantImageUrl} alt="Restaurant" />
//           </div>
//         </div>

//         {/* ================= ACTION INPUTS ================= */}

//         {status === "PENDING" && (
//           <>
//             <textarea
//               placeholder="Approval note (optional)"
//               value={approveReason}
//               onChange={e => setApproveReason(e.target.value)}
//             />

//             <textarea
//               placeholder="Reason for putting on hold"
//               value={holdReason}
//               onChange={e => setHoldReason(e.target.value)}
//             />

//             <textarea
//               placeholder="Rejection reason"
//               value={rejectReason}
//               onChange={e => setRejectReason(e.target.value)}
//             />
//           </>
//         )}

//         {status === "ON_HOLD" && (
//           <>
//             <textarea
//               placeholder="Approval note"
//               value={approveReason}
//               onChange={e => setApproveReason(e.target.value)}
//             />

//             <textarea
//               placeholder="Rejection reason"
//               value={rejectReason}
//               onChange={e => setRejectReason(e.target.value)}
//             />
//           </>
//         )}

//         {status === "APPROVED" && (
//           <textarea
//             placeholder="Suspension reason"
//             value={suspendReason}
//             onChange={e => setSuspendReason(e.target.value)}
//           />
//         )}

//         {status === "SUSPENDED" && (
//           <>
//             <textarea
//               placeholder="Permanent rejection reason"
//               value={rejectReason}
//               onChange={e => setRejectReason(e.target.value)}
//             />
//           </>
//         )}

//         {status !== "PERMANENTLY_BLOCKED" && (
//           <textarea
//             placeholder="Permanent block reason"
//             value={blockReason}
//             onChange={e => setBlockReason(e.target.value)}
//           />
//         )}

//         {/* ================= ACTION BUTTONS ================= */}

//         <div className="kyc-actions">

//           {status === "PENDING" && (
//             <>
//               <button className="approve" onClick={handleApprove}>Approve</button>
//               <button className="hold" onClick={handleHold}>Put On Hold</button>
//               <button className="reject" onClick={handleReject}>Reject</button>
//             </>
//           )}

//           {status === "ON_HOLD" && (
//             <>
//               <button className="approve" onClick={handleApproveAfterReview}>Approve After Review</button>
//               <button className="reject" onClick={handleReject}>Reject</button>
//             </>
//           )}

//           {status === "APPROVED" && (
//             <button className="suspend" onClick={handleSuspend}>Suspend Restaurant</button>
//           )}

//           {status === "SUSPENDED" && (
//             <>
//               <button className="approve" onClick={handleReinstate}>Reinstate</button>
//               <button className="reject" onClick={handleReject}>Permanently Reject</button>
//             </>
//           )}

//           {status !== "PERMANENTLY_BLOCKED" && (
//             <button className="block" onClick={handlePermanentBlock}>
//               Permanently Block
//             </button>
//           )}

//           {status === "PERMANENTLY_BLOCKED" && (
//             <div className="blocked-text">
//               This restaurant is permanently blocked
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }


// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import "./KycDetails.css";
// import {
//   getKycDetails,
//   approveKyc,
//   rejectKyc,
//   holdKyc,
//   suspendKyc,
//   reinstateRestaurant

// } from "../services/AdminService";

// export default function KycDetails() {
//   const { id } = useParams();
//   const [data, setData] = useState(null);
//   const [reason, setReason] = useState("");

//   const load = () => {
//     getKycDetails(id).then(res => {
//       setData(res.data);
//       setReason(""); // clear textarea after every refresh
//     });
//   };

//   useEffect(() => {
//     load();
//   }, [id]);

//   if (!data) return <p>Loading…</p>;

//   const { restaurant, bankDetails } = data;
//   const status = restaurant.status;

//   /* ================= ACTION HANDLERS ================= */

//   const handleApprove = () => {
//     approveKyc(id, "").then(load);
//   };

//   const handleApproveAfterReview = () => {
//     approveKyc(id, "Approved after admin review").then(load);
//   };

//   const handleHold = () => {
//     holdKyc(id, "Admin requested verification").then(load);
//   };

//   const handleReject = () => {
//     if (!reason.trim()) {
//       alert("Rejection reason is required");
//       return;
//     }
//     rejectKyc(id, reason).then(load);
//   };

//   const handleSuspend = () => {
//     if (!reason.trim()) {
//       alert("Suspension reason is required");
//       return;
//     }
//     suspendKyc(id, reason).then(load);
//   };

//  const handleReinstate = () => {
//   reinstateRestaurant(id).then(load);
// };

//   /* ================= UI ================= */

//   return (
//     <div className="kyc-page">
//       <div className="kyc-container">

//         {/* HEADER */}
//         <div className="kyc-header">
//           <div>
//             <h2>{restaurant.restaurantName}</h2>
//             <p className="kyc-sub">
//               {restaurant.ownerEmail} • {restaurant.city} • {restaurant.phone}
//             </p>
//           </div>
//           <div className={`status-badge ${status.toLowerCase()}`}>
//             {status}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <div className="kyc-layout">
//           <div className="kyc-card">
//             <div className="kyc-grid">
//               <div><b>ADDRESS</b>{restaurant.address}</div>
//               <div><b>CITY</b>{restaurant.city}</div>
//               <div><b>PAN</b>{restaurant.panCard}</div>
//               <div><b>ACCOUNT HOLDER</b>{bankDetails?.accountHolderName}</div>
//               <div><b>FSSAI</b>{restaurant.fssaiLicence}</div>
//               <div><b>ACCOUNT</b>{bankDetails?.accountNumber}</div>
//               <div><b>IFSC</b>{bankDetails?.ifscCode}</div>
//               <div><b>BRANCH</b>{bankDetails?.branchAddress}</div>
//             </div>
//           </div>

//           <div className="kyc-card">
//             <img src={restaurant.restaurantImageUrl} alt="Restaurant" />
//           </div>
//         </div>

//         {/* ACTIONS */}
//         <div className="kyc-actions">

//           {/* PENDING */}
//           {status === "PENDING" && (
//             <>
//               <button className="approve" onClick={handleApprove}>
//                 Approve
//               </button>

//               <button className="hold" onClick={handleHold}>
//                 Put On Hold
//               </button>

//               <textarea
//                 placeholder="Rejection reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button className="reject" onClick={handleReject}>
//                 Reject
//               </button>
//             </>
//           )}

//           {/* ON HOLD */}
//           {status === "ON_HOLD" && (
//             <button className="approve" onClick={handleApproveAfterReview}>
//               Approve After Review
//             </button>
//           )}

//           {/* APPROVED */}
//           {status === "APPROVED" && (
//             <>
//               <textarea
//                 placeholder="Suspension reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button className="suspend" onClick={handleSuspend}>
//                 Suspend Restaurant
//               </button>
//             </>
//           )}

//           {/* SUSPENDED */}
//           {status === "SUSPENDED" && (
//             <>
//               <button className="approve" onClick={handleReinstate}>
//                 Reinstate
//               </button>

//               <textarea
//                 placeholder="Permanent rejection reason"
//                 value={reason}
//                 onChange={e => setReason(e.target.value)}
//               />

//               <button className="reject" onClick={handleReject}>
//                 Permanently Reject
//               </button>
//             </>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }
