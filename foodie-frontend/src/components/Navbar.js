// import React, { useState, useEffect, useRef } from "react";
// import "./Navbar.css";
// import axios from "axios";
// import { HiLocationMarker } from "react-icons/hi";
// import {
//   FiSearch,
//   FiChevronDown,
//   FiUser,
//   FiShoppingCart,
//   FiMic
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const Navbar = ({ openAuth }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ already present
//   const menuRef = useRef(null);

//   /* ================= MIC ================= */

//   const [searchText, setSearchText] = useState("");
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const startVoiceSearch = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Voice search not supported in this browser");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     // recognition.onresult = (event) => {
//     //   setSearchText(event.results[0][0].transcript);
//     // };
//     recognition.onresult = (event) => {
//   const text = event.results[0][0].transcript;
//   setSearchText(text);

//   // auto-search after voice input
//   navigate(`/delivery?q=${encodeURIComponent(text.trim())}`);
//   setSearchText("");

// };

//     recognition.onend = () => setListening(false);

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   /* ================= STATE ================= */

//   const [address, setAddress] = useState("Enter your delivery location");
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   /* ================= CART COUNT ================= */

//   const fetchCartCount = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setCartCount(0);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "http://localhost:9091/users/cart/count",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCartCount(res.data);
//     } catch {
//       setCartCount(0);
//     }
//   };

//   /* ================= LOAD USER & ROLE ================= */

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedRole = localStorage.getItem("role");

//     if (storedUser) setUser(JSON.parse(storedUser));
//     if (storedRole) setRole(storedRole);
//   }, []);

//   /* ================= AUTH SYNC ================= */

//   useEffect(() => {
//     const syncAuth = () => {
//       const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(loggedIn);

//       if (loggedIn) {
//         setUser(JSON.parse(localStorage.getItem("user")));
//         setRole(localStorage.getItem("role"));
//         fetchCartCount();
//       } else {
//         setUser(null);
//         setRole(null);
//         setCartCount(0);
//       }
//     };

//     syncAuth();
//     window.addEventListener("auth-change", syncAuth);
//     return () => window.removeEventListener("auth-change", syncAuth);
//   }, []);

//   /* ================= CART CHANGE LISTENER ================= */

//   useEffect(() => {
//     window.addEventListener("cart-change", fetchCartCount);
//     return () => window.removeEventListener("cart-change", fetchCartCount);
//   }, []);

//   /* ================= OUTSIDE CLICK ================= */

//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ================= LOCATION ================= */

//   const getLocation = () => {
//     if (!navigator.geolocation) return;

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         try {
//           const res = await axios.get(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//           );

//           const detectedAddress =
//             res.data?.display_name || "Location found";

//           setAddress(detectedAddress);
//           localStorage.setItem("deliveryAddress", detectedAddress);
//         } catch {
//           setAddress("Unable to fetch address");
//         }
//         setLoading(false);
//       },
//       () => setLoading(false)
//     );
//   };

//   /* ================= SEARCH CLICK LOGIC ================= */

//   const handleSearchClick = () => {
//     if (location.pathname === "/") {
//       navigate("/delivery");
//     }
//   };

//   /* ================= CART CLICK LOGIC (NEW) ================= */

//   const handleCartClick = () => {
//     if (!isLoggedIn) {
//       openAuth();
//     } else {
//       navigate("/checkout");
//     }
//   };

//   /* ================= LOGOUT ================= */

//   const logout = () => {
//     localStorage.clear();
//     window.dispatchEvent(new Event("auth-change"));
//     setShowProfileMenu(false);
//     navigate("/");
//   };

//   /* ================= UI ================= */

//   return (
//     <header className="navbar">
//       <div className="nav-container">

//         {/* LOGO */}
//         <div className="logo" onClick={() => navigate("/")}>
//           <img src="logo1.png" alt="Foodie" />
//         </div>

//         {/* LOCATION + SEARCH */}
//         <div className="nav-search-wrapper">
//           <div className="location-box" onClick={getLocation}>
//             <HiLocationMarker className="location-icon" />
//             <span className="location-text">
//               {loading ? "Detecting location..." : address}
//             </span>
//             <FiChevronDown />
//           </div>

//           <div className="divider" />

//           <div className="search-box" onClick={handleSearchClick}>
//             <FiSearch className="search-icon" />
//             {/* <input
//               placeholder="Search for restaurant, cuisine or a dish"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             /> */}
//               <input
//   placeholder="Search for restaurant, cuisine or a dish"
//   value={searchText}
//   onChange={(e) => setSearchText(e.target.value)}
//   onKeyDown={(e) => {
//     if (e.key === "Enter" && searchText.trim()) {
//      navigate(`/search?q=${encodeURIComponent(searchText.trim())}`);
//      setSearchText("");

//     }
//   }}
// />



//           </div>

//           <FiMic
//             className={`mic-icon ${listening ? "active" : ""}`}
//             onClick={startVoiceSearch}
//           />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="nav-right">

//           {/* CART (UPDATED LOGIC) */}
//           <div className="cart-icon" onClick={handleCartClick}>
//             <FiShoppingCart />
//             <span className="cart-badge">{cartCount}</span>
//           </div>

//           {/* AUTH */}
//           {!isLoggedIn ? (
//             <button className="signup-btn" onClick={openAuth}>
//               Sign Up
//             </button>
//           ) : (
//             <div className="profile-wrapper" ref={menuRef}>
//               <div
//                 className="profile-trigger"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//               >
//                 <FiUser />
//                 <span>Hi {user?.name || "User"}!</span>
//               </div>

//               {showProfileMenu && (
//                 <div className="profile-menu">
//                   <div className="profile-options">
//                     <p onClick={() => navigate("/profile?tab=profile")}>Profile</p>
//                     <p onClick={() => navigate("/profile?tab=orders")}>Orders</p>
//                     <p onClick={() => navigate("/profile?tab=events")}>Food Events</p>
//                     <p onClick={() => navigate("/profile?tab=favourites")}>Favourites</p>
//                     <p onClick={() => navigate("/profile?tab=partner")}>Become a Partner</p>

//                     {(role === "ADMIN" || role === "ROLE_ADMIN") && (
//                       <p
//                         onClick={() => navigate("/admin")}
//                         style={{ color: "red", fontWeight: 600 }}
//                       >
//                         Admin Dashboard
//                       </p>
//                     )}

//                     <p className="logout" onClick={logout}>Logout</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;





import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import axios from "axios";
import { HiLocationMarker } from "react-icons/hi";
import {
  FiSearch,
  FiChevronDown,
  FiUser,
  FiShoppingCart,
  FiMic
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ openAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);

  /* ================= SEARCH ================= */

  const [searchText, setSearchText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const triggerSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchText("");
  };

  /* ================= VOICE SEARCH ================= */

  const startVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice search not supported in this browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;

      // // ✅ REMOVE TRAILING FULL STOP / PUNCTUATION
      //       text = text.trim().replace(/[.,!?]+$/, "");
      // triggerSearch(text);

        const cleanedText = text.trim().replace(/[.,!?]+$/, "");

  triggerSearch(cleanedText);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  /* ================= USER / CART / AUTH ================= */

  const [address, setAddress] = useState("Enter your delivery location");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const fetchCartCount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:9091/users/cart/count",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCartCount(res.data);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedRole) setRole(storedRole);
  }, []);

  useEffect(() => {
    const syncAuth = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      setIsLoggedIn(loggedIn);

      if (loggedIn) {
        setUser(JSON.parse(localStorage.getItem("user")));
        setRole(localStorage.getItem("role"));
        fetchCartCount();
      } else {
        setUser(null);
        setRole(null);
        setCartCount(0);
      }
    };

    syncAuth();
    window.addEventListener("auth-change", syncAuth);
    return () => window.removeEventListener("auth-change", syncAuth);
  }, []);

  useEffect(() => {
    window.addEventListener("cart-change", fetchCartCount);
    return () => window.removeEventListener("cart-change", fetchCartCount);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ================= LOCATION ================= */

  const getLocation = () => {
    if (!navigator.geolocation) return;

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const detectedAddress =
            res.data?.display_name || "Location found";

          setAddress(detectedAddress);
          localStorage.setItem("deliveryAddress", detectedAddress);
          window.dispatchEvent(new Event("address-change"));
        } catch {
          setAddress("Unable to fetch address");
        }
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  /* ================= CART ================= */

  const handleCartClick = () => {
    if (!isLoggedIn) openAuth();
    else navigate("/checkout");
  };

  const logout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("auth-change"));
    setShowProfileMenu(false);
    navigate("/");
  };

  /* ================= UI ================= */

  return (
    <header className="navbar">
      <div className="nav-container">

        {/* LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src="logo1.png" alt="Foodie" />
        </div>

        {/* LOCATION + SEARCH */}
        <div className="nav-search-wrapper">
          <div className="location-box" onClick={getLocation}>
            <HiLocationMarker className="location-icon" />
            <span className="location-text">
              {loading ? "Detecting location..." : address}
            </span>
            <FiChevronDown />
          </div>

          <div className="divider" />

          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              placeholder="Search for restaurant, cuisine or a dish"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") triggerSearch(searchText);
              }}
            />
          </div>

          <FiMic
            className={`mic-icon ${listening ? "active" : ""}`}
            onClick={startVoiceSearch}
          />
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          <div className="cart-icon" onClick={handleCartClick}>
            <FiShoppingCart />
            <span className="cart-badge">{cartCount}</span>
          </div>

          {!isLoggedIn ? (
            <button className="signup-btn" onClick={openAuth}>
              Sign Up
            </button>
          ) : (
            <div className="profile-wrapper" ref={menuRef}>
              <div
                className="profile-trigger"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <FiUser />
                <span>Hi {user?.name || "User"}!</span>
              </div>

              {showProfileMenu && (
                <div className="profile-menu">
                  <p onClick={() => navigate("/profile?tab=profile")}>Profile</p>
                  <p onClick={() => navigate("/profile?tab=orders")}>Orders</p>
                  <p onClick={() => navigate("/profile?tab=events")}>Food Events</p>
                  <p onClick={() => navigate("/profile?tab=favourites")}>Favourites</p>
                  <p onClick={() => navigate("/profile?tab=partner")}>Become a Partner</p>

                  {(role === "ADMIN" || role === "ROLE_ADMIN") && (
                    <p
                      onClick={() => navigate("/admin")}
                      style={{ color: "red", fontWeight: 600 }}
                    >
                      Admin Dashboard
                    </p>
                  )}

                  <p className="logout" onClick={logout}>Logout</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;












// import React, { useState, useEffect, useRef } from "react";
// import "./Navbar.css";
// import axios from "axios";
// import { HiLocationMarker } from "react-icons/hi";
// import {
//   FiSearch,
//   FiChevronDown,
//   FiUser,
//   FiShoppingCart,
//   FiMic
// } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const Navbar = ({ openAuth }) => {
//   const navigate = useNavigate();
//   const location = useLocation(); // ✅ ADDED
//   const menuRef = useRef(null);

//   /* ================= MIC ================= */

//   const [searchText, setSearchText] = useState("");
//   const [listening, setListening] = useState(false);
//   const recognitionRef = useRef(null);

//   const startVoiceSearch = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Voice search not supported in this browser");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-IN";
//     recognition.continuous = false;
//     recognition.interimResults = false;

//     recognition.onstart = () => setListening(true);
//     recognition.onresult = (event) => {
//       setSearchText(event.results[0][0].transcript);
//     };
//     recognition.onend = () => setListening(false);

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   /* ================= STATE ================= */

//   const [address, setAddress] = useState("Enter your delivery location");
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);

//   /* ================= CART COUNT ================= */

//   const fetchCartCount = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setCartCount(0);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         "http://localhost:9091/users/cart/count",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setCartCount(res.data);
//     } catch {
//       setCartCount(0);
//     }
//   };

//   /* ================= LOAD USER & ROLE ================= */

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedRole = localStorage.getItem("role");

//     if (storedUser) setUser(JSON.parse(storedUser));
//     if (storedRole) setRole(storedRole);
//   }, []);

//   /* ================= AUTH SYNC ================= */

//   useEffect(() => {
//     const syncAuth = () => {
//       const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(loggedIn);

//       if (loggedIn) {
//         setUser(JSON.parse(localStorage.getItem("user")));
//         setRole(localStorage.getItem("role"));
//         fetchCartCount(); // ✅ FIXED
//       } else {
//         setUser(null);
//         setRole(null);
//         setCartCount(0);
//       }
//     };

//     syncAuth();
//     window.addEventListener("auth-change", syncAuth);
//     return () => window.removeEventListener("auth-change", syncAuth);
//   }, []);

//   /* ================= CART CHANGE LISTENER ================= */

//   useEffect(() => {
//     window.addEventListener("cart-change", fetchCartCount);
//     return () => window.removeEventListener("cart-change", fetchCartCount);
//   }, []);

//   /* ================= OUTSIDE CLICK ================= */

//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   /* ================= LOCATION ================= */

//   // const getLocation = () => {
//   //   if (!navigator.geolocation) return;

//   //   setLoading(true);
//   //   navigator.geolocation.getCurrentPosition(
//   //     async (pos) => {
//   //       const { latitude, longitude } = pos.coords;
//   //       try {
//   //         const res = await axios.get(
//   //           `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//   //         );
//   //         setAddress(res.data?.display_name || "Location found");
//   //       } catch {
//   //         setAddress("Unable to fetch address");
//   //       }
//   //       setLoading(false);
//   //     },
//   //     () => setLoading(false)
//   //   );
//   // };

//   const getLocation = () => {
//     if (!navigator.geolocation) return;

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         try {
//           const res = await axios.get(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//           );

//           const detectedAddress =
//             res.data?.display_name || "Location found";

//           setAddress(detectedAddress);

//           // ✅ STORE IN LOCAL STORAGE
//           localStorage.setItem("deliveryAddress", detectedAddress);

//         } catch {
//           setAddress("Unable to fetch address");
//         }
//         setLoading(false);
//       },
//       () => setLoading(false)
//     );
//   };

//   /* ================= LOGOUT ================= */

//   const logout = () => {
//     localStorage.clear();
//     window.dispatchEvent(new Event("auth-change"));
//     setShowProfileMenu(false);
//     navigate("/");
//   };

//   /* ================= UI ================= */

//   return (
//     <header className="navbar">
//       <div className="nav-container">

//         {/* LOGO */}
//         <div className="logo" onClick={() => navigate("/")}>
//           <img src="logo1.png" alt="Foodie" />
//         </div>

//         {/* LOCATION + SEARCH */}
//         <div className="nav-search-wrapper" >
//           <div className="location-box" onClick={getLocation}>
//             <HiLocationMarker className="location-icon" />
//             <span className="location-text">
//               {loading ? "Detecting location..." : address}
//             </span>
//             <FiChevronDown />
//           </div>

//           <div className="divider" />

//           <div className="search-box">
//             <FiSearch className="search-icon" />
//             <input
//               placeholder="Search for restaurant, cuisine or a dish"
//               value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//             />
//           </div>

//           <FiMic
//             className={`mic-icon ${listening ? "active" : ""}`}
//             onClick={startVoiceSearch}
//           />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="nav-right">

//           {/* CART */}
//           <div className="cart-icon" onClick={() => navigate("/checkout")}>
//             <FiShoppingCart />
//             {<span className="cart-badge">{cartCount}</span>}
//           </div>

//           {/* AUTH */}
//           {!isLoggedIn ? (
//             <button className="signup-btn" onClick={openAuth}>
//               Sign Up
//             </button>
//           ) : (
//             <div className="profile-wrapper" ref={menuRef}>
//               <div
//                 className="profile-trigger"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//               >
//                 <FiUser />
//                 <span>Hi {user?.name || "User"}!</span>
//               </div>

//               {showProfileMenu && (
//                 <div className="profile-menu">
//                   <div className="profile-options">
//                     <p onClick={() => navigate("/profile?tab=profile")}>Profile</p>
//                     <p onClick={() => navigate("/profile?tab=orders")}>Orders</p>
//                     <p onClick={() => navigate("/profile?tab=events")}>Food Events</p>
//                     <p onClick={() => navigate("/profile?tab=favourites")}>Favourites</p>
//                     <p onClick={() => navigate("/profile?tab=partner")}>Become a Partner</p>

//                     {(role === "ADMIN" || role === "ROLE_ADMIN") && (
//                       <p
//                         onClick={() => navigate("/admin")}
//                         style={{ color: "red", fontWeight: 600 }}
//                       >
//                         Admin Dashboard
//                       </p>
//                     )}

//                     <p className="logout" onClick={logout}>Logout</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;


// import React, { useState, useEffect, useRef } from "react";
// import "./Navbar.css";
// import axios from "axios";
// import { HiLocationMarker } from "react-icons/hi";
// import { FiSearch, FiChevronDown, FiUser, FiShoppingCart,FiMic  } from "react-icons/fi";
// import { useNavigate } from "react-router-dom";

// const Navbar = ({ openAuth }) => {
//   const navigate = useNavigate();
//   const menuRef = useRef();
// //mic
// const [searchText, setSearchText] = useState("");
// const [listening, setListening] = useState(false);
// const recognitionRef = useRef(null);
// const startVoiceSearch = () => {
//   if (!("webkitSpeechRecognition" in window)) {
//     alert("Voice search not supported in this browser");
//     return;
//   }

//   const recognition = new window.webkitSpeechRecognition();
//   recognition.lang = "en-IN";
//   recognition.continuous = false;
//   recognition.interimResults = false;

//   recognition.onstart = () => setListening(true);

//   recognition.onresult = (event) => {
//     const text = event.results[0][0].transcript;
//     setSearchText(text);
//   };

//   recognition.onend = () => setListening(false);

//   recognition.start();
//   recognitionRef.current = recognition;
// };


//   const [address, setAddress] = useState("Enter your delivery location");
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [cartCount, setCartCount] = useState(0);

//   const [user, setUser] = useState("");
//   const [role, setRole] = useState(null);

//   // Load user & role on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const storedRole = localStorage.getItem("role");

//     if (storedUser) setUser(JSON.parse(storedUser));
//     if (storedRole) setRole(storedRole);
//   }, []);

//   // Listen to login/logout updates
//   useEffect(() => {
//     const syncAuth = () => {
//       const loggedIn = localStorage.getItem("isLoggedIn") === "true";
//       setIsLoggedIn(loggedIn);

//       if (loggedIn) {
//         const storedUser = localStorage.getItem("user");
//         const storedRole = localStorage.getItem("role");

//         if (storedUser) setUser(JSON.parse(storedUser));
//         if (storedRole) setRole(storedRole);
//      fetchCartCount(); // ✅ IMPORTANT
//     } else {
//       setUser(null);
//       setRole(null);
//       setCartCount(0); // ✅ RESET
//     }
//   };

    

//     syncAuth();
//     window.addEventListener("auth-change", syncAuth);

//     return () => window.removeEventListener("auth-change", syncAuth);
//   }, []);


//  const fetchCartCount = async () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     setCartCount(0);
//     return;
//   }

//   try {
//     const res = await axios.get(
//       "http://localhost:9091/users/cart/count",
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );
//     setCartCount(res.data);
//   } catch {
//     setCartCount(0);
//   }
// };



//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) {
//         setShowProfileMenu(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   const getLocation = () => {
//     if (!navigator.geolocation) return;

//     setLoading(true);
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const { latitude, longitude } = pos.coords;
//         try {
//           const res = await axios.get(
//             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
//           );
//           setAddress(res.data?.display_name || "Location found");
//         } catch {
//           setAddress("Unable to fetch address");
//         }
//         setLoading(false);
//       },
//       () => setLoading(false)
//     );
//   };

//   const logout = () => {
//     localStorage.clear();
//     window.dispatchEvent(new Event("auth-change"));
//     setShowProfileMenu(false);
//     navigate("/");
//   };


// //   useEffect(() => {
// //   const updateCartCount = () => {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;

// //     axios
// //       .get("http://localhost:9091/users/cart/count", {
// //         headers: {
// //           Authorization: `Bearer ${token}`,
// //         },
// //       })
// //       .then((res) => {
// //         setCartCount(res.data);
// //       });
// //   };

// //   window.addEventListener("cart-change", updateCartCount);

// //   return () => {
// //     window.removeEventListener("cart-change", updateCartCount);
// //   };
// // }, []);


//   return (
//     <header className="navbar">
//       <div className="nav-container">

//         {/* LOGO */}
//         <div className="logo" onClick={() => navigate("/")}>
//           <img src="logo1.png" alt="Foodie" />
//         </div>

//         {/* LOCATION + SEARCH */}
//         <div className="nav-search-wrapper">
//           <div className="location-box" onClick={getLocation}>
//             <HiLocationMarker className="location-icon" />
//             <span className="location-text">
//               {loading ? "Detecting location..." : address}
//             </span>
//             <FiChevronDown />
//           </div>

//           <div className="divider" />

//           <div className="search-box">
//             <FiSearch className="search-icon" />
//             <input placeholder="Search for restaurant, cuisine or a dish"
//             value={searchText}
//               onChange={(e) => setSearchText(e.target.value)}
//              />
//           </div>
//           <FiMic
//             className={`mic-icon ${listening ? "active" : ""}`}
//             onClick={startVoiceSearch}
//           />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="nav-right">

//          {/* CART */}
// <div className="cart-icon" onClick={() => navigate("/checkout")}>
//   <FiShoppingCart />
//   {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
// </div>

//           {/* AUTH */}
//           {!isLoggedIn ? (
//             <button className="signup-btn" onClick={openAuth}>
//               Sign Up
//             </button>
//           ) : (
//             <div className="profile-wrapper" ref={menuRef}>
//               <div
//                 className="profile-trigger"
//                 onClick={() => setShowProfileMenu(!showProfileMenu)}
//               >
//                 <FiUser />
//                 <span>Hi {user?.name || "User"}!</span>
//               </div>

//               {showProfileMenu && (
//                 <div className="profile-menu">

//                   <div className="profile-header">
                    
                    
//                   </div>

//                   <div className="profile-options">
//                     <p onClick={() => navigate("/profile?tab=profile")}>Profile</p>
//                     <p onClick={() => navigate("/profile?tab=orders")}>Orders</p>
//                     <p onClick={() => navigate("/profile?tab=events")}>Food Events</p>
//                     <p onClick={() => navigate("/profile?tab=favourites")}>Favourites</p>
//                     <p onClick={() => navigate("/profile?tab=partner")}>Become a Partner</p>

//                     {/* ADMIN DASHBOARD */}
//                     {(role === "ADMIN" || role === "ROLE_ADMIN") && (
//                       <p
//                         onClick={() => navigate("/admin")}
//                         style={{ color: "red", fontWeight: 600 }}
//                       >
//                         Admin Dashboard
//                       </p>
//                     )}

//                     <p className="logout" onClick={logout}>Logout</p>
//                   </div>

//                 </div>
//               )}
//             </div>
            
//           )}
//         </div>

        
//       </div>
//     </header>
//   );
// };

// export default Navbar;
