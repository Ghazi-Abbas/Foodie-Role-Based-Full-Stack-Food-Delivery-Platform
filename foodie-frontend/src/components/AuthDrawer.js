import React, { useState, useRef, useEffect } from "react";
import "./AuthDrawer.css";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AuthDrawer({ close }) {
  const navigate = useNavigate();
  
const [forgotEmail, setForgotEmail] = useState("");
const [resetEmail, setResetEmail] = useState("");
const [resetOtp, setResetOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  
const [mode, setMode] = useState("login");
const [step, setStep] = useState(1);

// LOGIN
const [loginEmail, setLoginEmail] = useState("");
const [loginPass, setLoginPass] = useState("");

// SIGNUP EMAIL
const [signupEmail, setSignupEmail] = useState("");

// OTP
const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const otpRefs = useRef([]);

// PROFILE
const [name, setName] = useState("");
const [confirmPass, setConfirmPass] = useState("");
const [newPass, setNewPass] = useState("");

// TIMER
const [timer, setTimer] = useState(600);
const [canResend, setCanResend] = useState(false);

useEffect(() => {
  if (step === 2 && timer > 0) {
    const t = setTimeout(() => setTimer(prev => prev - 1), 1000);
    return () => clearTimeout(t);
  }

  if (timer === 0) setCanResend(true);
}, [timer, step]);

const formatTime = () => {
  const m = Math.floor(timer / 60);
  const s = timer % 60;
  return `${m < 10 ? "0"+m : m}:${s < 10 ? "0"+s : s}`;
};

const handleClose = () => {
  setMode("login");
  setStep(1);
  close();
};

// PASSWORD VALIDATION
const isValidPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,11}$/.test(password);
};

const isValidName = (name) => {
  const trimmed = name.trim();
  const nameRegex = /^[A-Za-z ]+$/; // alphabets + spaces only

  return trimmed.length > 4 && nameRegex.test(trimmed);
};
const isValidEmail = (email) => {
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(trimmed);
};


// ===================== LOGIN =====================
// const handleLogin = () => {

//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   const url = "http://localhost:9090/auth/login";

//   axios.post(
//     url,
//     { email: loginEmail, password: loginPass },
//     { headers: { "Content-Type": "application/json" } }
//   )

//   .then(async (res) => {
//     toast.success("Login Successful");

//     const token = res.data?.accessToken;

//     if (!token) {
//       toast.error("Token not received from server");
//       return;
//     }

//     localStorage.setItem("token", token);
//     localStorage.setItem("isLoggedIn", "true");

//     // fetch user details + SAVE ROLE
//     await fetchUserDetails(token);

//     window.dispatchEvent(new Event("auth-change"));
//   })

//   .catch((err) => {
//     console.error("LOGIN ERROR:", err);

//     const message =
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Invalid email or password";

//     toast.error(message);
//   });
// };
// 🔥 Restore login session using refresh token (runs on page load / reload)



const restoreSession = async () => {
  try {
    const res = await axios.post(
      "http://localhost:9090/auth/refresh",
      {},
      { withCredentials: true }
    );

    const newToken = res.data.accessToken;
    localStorage.setItem("token", newToken);
    localStorage.setItem("isLoggedIn", "true");

    // 🔥 Load profile
    const me = await axios.get(
      "http://localhost:9090/auth/me",
      { headers: { Authorization: `Bearer ${newToken}` } }
    );

    localStorage.setItem("user", JSON.stringify(me.data));
// just now
    // let role = me.data.roles?.[0] || "USER";
    // role = role.replace("ROLE_", "");
    // localStorage.setItem("role", role);

    localStorage.setItem("user", JSON.stringify(me.data));
window.dispatchEvent(new Event("auth-change"));
return true;




    window.dispatchEvent(new Event("auth-change"));
    return true;
  } catch {
    return false;
  }
};
useEffect(() => {
  restoreSession();
}, []);

const getAuthFromToken=()=> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      email: payload.sub,
      userId: payload.userId,
      roles: payload.roles || []
    };
  } catch {
    return null;
  }
}


const handleLogin = () => {
  // if (!loginEmail.trim()) return toast.error("Please enter email");
  // if (!loginPass.trim()) return toast.error("Please enter password");

  if (!loginEmail.trim())
  return toast.error("Please enter your email address");

if (!isValidEmail(loginEmail))
  return toast.error("Please enter a valid email address");

if (!loginPass.trim())
  return toast.error("Please enter your password");


  axios.post(
    "http://localhost:9090/auth/login",
    { email: loginEmail, password: loginPass },
    {
       withCredentials: true, // 🔥 REQUIRED to receive refresh-token cookie
       headers: { "Content-Type": "application/json" } }
  )
  // .then((res) => {
  //   toast.success("Login Successful");

  //   const token = res.data?.accessToken;
  //   if (!token) return toast.error("Token not received");

  //   // Save Token
  //   localStorage.setItem("token", token);
  //   localStorage.setItem("isLoggedIn", "true");

  //   // 🔥 Decode JWT
  //   const payload = JSON.parse(atob(token.split(".")[1]));
  //   let role = payload.roles?.[0] || payload.role;

  //   role = (role || "").toUpperCase();
  //   if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

  //   localStorage.setItem("role", role);

  //   console.log("FINAL ROLE ===>", role);

  //   window.dispatchEvent(new Event("auth-change"));

  //   // 🎯 Redirect
  //   if (role === "ADMIN") {
  //     toast.success("Welcome Admin");
  //     close();
  //     navigate("admin/dashboard");
  //   } else {
  //     close();
  //     navigate("/");
  //   }
  // })

  .then(async (res) => {
  toast.success("Login Successful");

  const token = res.data?.accessToken;
  if (!token) return toast.error("Token not received");

  localStorage.setItem("token", token);
  localStorage.setItem("isLoggedIn", "true");

  // 🔥 Load real profile immediately
  const me = await axios.get(
    "http://localhost:9090/auth/me",
    { headers: { Authorization: `Bearer ${token}` } }
  );

  localStorage.setItem("user", JSON.stringify(me.data));

  // let role = me.data.roles?.[0] || "USER";
  // role = role.replace("ROLE_", "");
  // localStorage.setItem("role", role);

  // window.dispatchEvent(new Event("auth-change"));

  // if (role === "ADMIN") {
  //   toast.success("Welcome Admin");
  //   close();
  //   navigate("/admin/dashboard");
  // } else {
  //   toast.success("Welcome " + me.data.name);
  //   close();
  //   navigate("/");
  // }

 window.dispatchEvent(new Event("auth-change"));

const auth = getAuthFromToken();
const roles = (auth?.roles || []).map(r =>
  r.replace("ROLE_", "").toUpperCase()
);

if (roles.includes("ADMIN")) {
  toast.success("Welcome Admin");
  close();
  navigate("/admin/dashboard");
} else {
  toast.success("Welcome " + me.data.name);
  close();
  navigate("/");
}




})

  .catch((err) => {
    console.error("LOGIN ERROR:", err);
    toast.error(
      err.response?.data?.message ||
      err.response?.data?.error ||
      "Invalid email or password"
    );
  });
};

// const handleLogin = async () => {
//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   try {
//     // 1️⃣ Login
//     const res = await axios.post(
//       "http://localhost:9090/auth/login",
//       { email: loginEmail, password: loginPass },
//       {
//         withCredentials: true,   // refresh token cookie
//         headers: { "Content-Type": "application/json" }
//       }
//     );

//     const token = res.data?.accessToken;
//     if (!token) throw new Error("Access token missing");

//     // 2️⃣ Save token
//     localStorage.setItem("token", token);
//     localStorage.setItem("isLoggedIn", "true");

//     // 3️⃣ Decode JWT (fast role detection)
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     let jwtRole = payload.roles?.[0] || payload.role;

//     jwtRole = (jwtRole || "USER").toUpperCase();
//     if (jwtRole.startsWith("ROLE_")) jwtRole = jwtRole.replace("ROLE_", "");

//     // 4️⃣ Load real profile from AUTH SERVICE
//     // (this fixes "Hi User" + profile name bug)
//     const meRes = await axios.get(
//       "http://localhost:9090/auth/me",
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const user = meRes.data;
//     localStorage.setItem("user", JSON.stringify(user));

//     // 5️⃣ Final role (backend wins over JWT)
//     let finalRole = user.roles?.[0] || jwtRole;
//     finalRole = finalRole.toUpperCase().replace("ROLE_", "");
//     localStorage.setItem("role", finalRole);

//     console.log("FINAL ROLE =>", finalRole);
//     console.log("USER =>", user);

//     // 6️⃣ Tell whole app auth is ready
//     window.dispatchEvent(new Event("auth-change"));

//     // 7️⃣ Redirect
//     if (finalRole === "ADMIN") {
//       toast.success("Welcome Admin");
//       close();
//       navigate("/admin/dashboard");
//     } else {
//       toast.success("Welcome " + user.name);
//       close();
//       navigate("/");
//     }

//   } catch (err) {
//     console.error("LOGIN ERROR", err);

//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data ||
//       "Invalid email or password"
//     );
//   }
// };


// const handleLogin = async () => {
//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   try {
//     const res = await axios.post(
//       "http://localhost:9090/auth/login",
//       { email: loginEmail, password: loginPass },
//       { withCredentials: true }
//     );

//     const token = res.data.accessToken;
//     if (!token) throw new Error("Token missing");

//     // Save token
//     localStorage.setItem("token", token);
//     localStorage.setItem("isLoggedIn", "true");

//     // 🔥 LOAD REAL USER PROFILE
//     const meRes = await axios.get(
//       "http://localhost:9090/auth/me",
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );

//     const user = meRes.data;

//     localStorage.setItem("user", JSON.stringify(user));

//     // role from backend (not JWT)
//     let role = user.roles?.[0] || "USER";
//     role = role.toUpperCase().replace("ROLE_", "");
//     localStorage.setItem("role", role);

//     // 🔥 Tell whole app user is ready
//     window.dispatchEvent(new Event("auth-change"));

//     if (role === "ADMIN") {
//       toast.success("Welcome Admin");
//       close();
//       navigate("/admin/dashboard");
//     } else {
//       toast.success("Welcome " + user.name);
//       close();
//       navigate("/");
//     }

//   } catch (err) {
//     console.error("LOGIN ERROR", err);
//     toast.error(
//       err.response?.data ||
//       "Invalid email or password"
//     );
//   }
// };


// const handleLogin = () => {
//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   axios.post(
//     "http://localhost:9090/auth/login",
//     { email: loginEmail, password: loginPass },
//     {
//       withCredentials: true,
//       headers: { "Content-Type": "application/json" }
//     }
//   )
//   .then(async (res) => {
//     toast.success("Login Successful");

//     const token = res.data?.accessToken;
//     if (!token) return toast.error("Token not received");

//     // ================= SAVE TOKEN =================
//     localStorage.setItem("token", token);
//     localStorage.setItem("isLoggedIn", "true");

//     // ================= GET ROLE FROM JWT =================
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     let role = payload.roles?.[0] || payload.role;

//     role = (role || "").toUpperCase();
//     if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

//     localStorage.setItem("role", role);
//     console.log("FINAL ROLE ===>", role);

//     // ================= LOAD USER PROFILE =================
//     let user = null;

    
     
        
//         const resUser = await axios.get(
//           "http://localhost:9091/users/me",
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         user = resUser.data;
      
    

//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     }

//     // 🔥 Tell UI that auth state changed
//     window.dispatchEvent(new Event("auth-change"));

//     // ================= REDIRECT =================
//     if (role === "ADMIN") {
//       toast.success("Welcome Admin");
//       close();
//       navigate("/admin/dashboard");
//     } else {
//       toast.success("Welcome " + (user?.name || "User"));
//       close();
//       navigate("/");
//     }

//   })
//   .catch((err) => {
//     console.error("LOGIN ERROR:", err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Invalid email or password"
//     );
//   });
// };


// const handleLogin = async () => {
//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   try {
//     const res = await axios.post(
//       "http://localhost:9090/auth/login",
//       { email: loginEmail, password: loginPass },
//       {
//         withCredentials: true,
//         headers: { "Content-Type": "application/json" }
//       }
//     );

//     toast.success("Login Successful");

//     const token = res.data?.accessToken;
//     if (!token) return toast.error("Token not received");

//     // =========================
//     // SAVE TOKEN
//     // =========================
//     localStorage.setItem("token", token);
//     localStorage.setItem("isLoggedIn", "true");

//     // =========================
//     // 🔥 LOAD USER PROFILE
//     // =========================
//     let user = null;

//     try {
//       const resUser = await axios.get(
//         "http://localhost:9091/users/me",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       user = resUser.data;
//     } catch {
//       // Try Admin service
//       const resAdmin = await axios.get(
//         "http://localhost:9093/admin/me",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       user = resAdmin.data;
//     }

//     if (!user) {
//       toast.error("Unable to load user profile");
//       return;
//     }

//     // =========================
//     // SAVE USER
//     // =========================
//     localStorage.setItem("user", JSON.stringify(user));

//     // =========================
//     // ROLE DETECTION (CORRECT)
//     // =========================
//     let role = null;

//     // 1️⃣ Backend role
//     if (user.role) role = user.role;
//     else if (user.roles?.length) role = user.roles[0];

//     // 2️⃣ Fallback JWT
//     if (!role) {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       role = payload.roles?.[0] || payload.role;
//     }

//     // =========================
//     // NORMALIZE ROLE
//     // =========================
//     role = (role || "").toUpperCase();
//     if (role.startsWith("ROLE_")) role = role.replace("ROLE_", "");

//     localStorage.setItem("role", role);

//     console.log("FINAL ROLE ===>", role);

//     window.dispatchEvent(new Event("auth-change"));

//     // =========================
//     // REDIRECT
//     // =========================
//     if (role === "ADMIN") {
//       toast.success("Welcome Admin");
//       close();
//       navigate("/admin/dashboard");
//     } else {
//       toast.success("Welcome " + user.name);
//       close();
//       navigate("/");
//     }

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Invalid email or password"
//     );
//   }
// };


// const handleLogin = () => {
//   if (!loginEmail.trim()) return toast.error("Please enter email");
//   if (!loginPass.trim()) return toast.error("Please enter password");

//   axios.post(
//     "http://localhost:9090/auth/login",
//     { email: loginEmail, password: loginPass },
//     {
//       withCredentials: true, // 🔥 REQUIRED for refresh token cookie
//       headers: { "Content-Type": "application/json" }
//     }
//   )
//   .then((res) => {
//     toast.success("Login Successful");

//     const { accessToken, roles } = res.data;

//     if (!accessToken) return toast.error("Access token missing");

//     // ✅ Store Access Token
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("isLoggedIn", "true");

//     // ✅ Store roles (from backend, not JWT)
//     localStorage.setItem("roles", JSON.stringify(roles));

//     const mainRole = roles?.[0];

//     console.log("FINAL ROLE =>", mainRole);

//     window.dispatchEvent(new Event("auth-change"));

//     // 🎯 Redirect
//     if (mainRole === "ADMIN") {
//       toast.success("Welcome Admin");
//       close();
//       navigate("/admin/dashboard");
//     } else {
//       close();
//       navigate("/");
//     }
//   })
//   .catch((err) => {
//     console.error("LOGIN ERROR:", err);
//     toast.error(
//       err.response?.data?.message ||
//       err.response?.data?.error ||
//       "Invalid email or password"
//     );
//   });
// };




// ===================== FETCH USER + SAVE ROLE =====================
// const fetchUserDetails = async (token) => {
//   const url = "http://localhost:9091/users/me";

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     });

//     const userData = response.data;
//     console.log("USER DATA:", userData);

//     localStorage.setItem("user", JSON.stringify(userData));

//     // ================= SAVE ROLE =================
//     let role = null;

//     if (userData.role) {
//       role = userData.role;
//     } 
//     else if (userData.roles?.length) {
//       role = userData.roles[0];
//     }

//     // fallback decode JWT if backend doesn’t send role
//     if (!role) {
//       try {
//         const payload = JSON.parse(atob(token.split(".")[1]));
//         if (payload?.role) role = payload.role;
//         else if (payload?.roles?.length) role = payload.roles[0];
//       } catch {}
//     }

//     if (role) {
//       localStorage.setItem("role", role);
//       console.log("ROLE SAVED:", role);
//     }

//     toast.success("User Data Loaded");
//   }

//  catch (err) {
//   console.error(
//     "USER FETCH ERROR ===>",
//     err.response?.status,
//     err.response?.data
//   );

//   let message = "Failed to load user data";

//   if (err.response?.status === 401) message = "Unauthorized / Token rejected";
//   if (err.response?.status === 403) message = "Forbidden / Access denied";

//   toast.error(message);
// }
// };

// just now
// const fetchUserDetails = async (token) => {

//   const headers = {
//     Authorization: `Bearer ${token}`,
//     "Content-Type": "application/json"
//   };

//   let userData = null;

//   try {
//     // 1️⃣ Try USER SERVICE
//     const res = await axios.get(
//       "http://localhost:9091/users/me",
//       { headers }
//     );
//     userData = res.data;
//     console.log("User Service Data:", userData);

//   } catch (err) {
//     console.log("User service failed, trying Admin Service...");
//   }

//   // 2️⃣ Try ADMIN SERVICE if user service failed
//   if (!userData) {
//     try {
//       const res = await axios.get(
//         "http://localhost:9093/admin/me",
//         { headers }
//       );
//       userData = res.data;
//       console.log("Admin Service Data:", userData);

//     } catch (err) {
//       console.error("Admin fetch failed:", err);
//     }
//   }

//   // ❌ Still failed
//   if (!userData) {
//     toast.error("Failed to load user details");
//     return null;
//   }

//   // ✅ Save user
//   localStorage.setItem("user", JSON.stringify(userData));

//   // =========================
//   //  ROLE DETECTION LOGIC
//   // =========================
//   let role = null;

//   // Case 1 → backend returns single role
//   if (userData.role)
//     role = userData.role;

//   // Case 2 → backend returns roles array
//   else if (userData.roles?.length)
//     role = userData.roles[0];

//   // Case 3 → decode JWT fallback
//   if (!role) {
//     try {
//       const payload = JSON.parse(atob(token.split(".")[1]));
//       if (payload?.role)
//         role = payload.role;
//       else if (payload?.roles?.length)
//         role = payload.roles[0];
//     } catch {}
//   }

//   // =========================
//   //  NORMALIZE ROLE
//   // =========================
//   if (role) {
//     role = role.toUpperCase();

//     // remove ROLE_ prefix if present
//     if (role.startsWith("ROLE_")) {
//       role = role.replace("ROLE_", "");
//     }

//     localStorage.setItem("role", role);
//     console.log("ROLE SAVED:", role);
//   }

//   toast.success("User Data Loaded");

//   return role;
// };

const fetchUserDetails = async (token) => {

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  let userData = null;

  try {
    // 1️⃣ Try USER SERVICE
    const res = await axios.get(
      "http://localhost:9091/users/me",
      { headers }
    );
    userData = res.data;
    console.log("User Service Data:", userData);

  } catch (err) {
    console.log("User service failed, trying Admin Service...");
  }

  // 2️⃣ Try ADMIN SERVICE if user service failed
  if (!userData) {
    try {
      const res = await axios.get(
        "http://localhost:9093/admin/me",
        { headers }
      );
      userData = res.data;
      console.log("Admin Service Data:", userData);

    } catch (err) {
      console.error("Admin fetch failed:", err);
    }
  }

  // ❌ Still failed
  if (!userData) {
    toast.error("Failed to load user details");
    return null;
  }

  // ✅ Save user ONLY
  localStorage.setItem("user", JSON.stringify(userData));

  toast.success("User Data Loaded");

  return userData;
};





// ===================== SEND OTP =====================
const handleSendOtp = () => {
  // if (!signupEmail.trim()) return toast.error("Please enter email");
if (!signupEmail.trim())
    return toast.error("Please enter your email address");

  if (!isValidEmail(signupEmail))
    return toast.error("Please enter a valid email address");
  axios.post(
    "http://localhost:9090/auth/request-otp",
    { email: signupEmail },
    { headers: { "Content-Type": "application/json" } }
  )
  .then(() => {
    toast.success("OTP sent to email");
    setTimer(600);
    setCanResend(false);
    setStep(2);
  })
  .catch(err => {
    console.error(err);
    toast.error(err.response?.data || "Failed to send OTP");
  });
};


// OTP Input Handler
const handleOtpChange = (value, index) => {
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value !== "" && index < 5) otpRefs.current[index + 1].focus();
};

const handleOtpKeyDown = (e, index) => {
  if (e.key === "Backspace" && index > 0 && !otp[index]) {
    otpRefs.current[index - 1].focus();
  }
};




// ================= VERIFY OTP =================
const handleVerifyOtp = () => {
  const code = otp.join("");

  if (code.length !== 6) return toast.error("Enter 6 digit OTP");

  axios.post(
    "http://localhost:9090/auth/verify-otp",
    { email: signupEmail, otp: code },
    { headers: { "Content-Type": "application/json" } }
  )

  .then((res) => {
     const SignUptoken = res.data.signupToken;
  localStorage.setItem("signupToken", SignUptoken);
    toast.success("OTP Verified");
    setStep(3);
  })

  .catch(err => {
    console.error(err);

    let errorMessage = "Something went wrong";

    if (err.response?.data) {
      if (typeof err.response.data === "string") errorMessage = err.response.data;
      else if (err.response.data.message) errorMessage = err.response.data.message;
      else if (err.response.data.error) errorMessage = err.response.data.error;
    }

    toast.error(errorMessage);
  });
};




// ================= FORGOT PASSWORD =================
const handleForgotPass = () => {
  if (!forgotEmail.trim()) return toast.error("Enter email");

  axios.post(
    "http://localhost:9090/auth/forgot-password",
    { email: forgotEmail },
    { headers: { "Content-Type": "application/json" } }
  )

  .then(() => {
    toast.success("OTP sent to your email");
    setResetEmail(forgotEmail);
    setOtp(["", "", "", "", "", ""]);
    setMode("reset");
  })

  .catch(err => {
    console.error(err);

    let message = "Something went wrong";

    if (err.response?.data) {
      if (typeof err.response.data === "string") message = err.response.data;
      else if (err.response.data.message) message = err.response.data.message;
      else if (err.response.data.error) message = err.response.data.error;
    }

    toast.error(message);
  });
};




// ================= RESET PASSWORD =================
const handleResetPass = () => {
  const otpCode = otp.join("");

  // if (!resetEmail.trim()) return toast.error("Email missing");

  if (!loginEmail.trim())
  return toast.error("Please enter your email address");

if (!isValidEmail(loginEmail))
  return toast.error("Please enter a valid email address");
  if (otpCode.length !== 6) return toast.error("Enter 6 digit OTP");
  if (!newPassword || !confirmPassword) return toast.error("Fill all fields");

  if (!isValidPassword(newPassword))
    return toast.error("Password must be 6–11 chars with uppercase, lowercase, number & special character");

  if (newPassword !== confirmPassword)
    return toast.error("Passwords do not match");

  axios.post(
    "http://localhost:9090/auth/reset-password",
    { email: resetEmail, otp: otpCode, newPassword },
    { headers: { "Content-Type": "application/json" } }
  )

  .then(() => {
    toast.success("Password reset successfully 🎉");
    setMode("login");
    setForgotEmail("");
    setResetEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
  })

  .catch(err => {
    console.error(err);

    let message = "Reset failed";

    if (err.response?.data) {
      if (typeof err.response.data === "string") message = err.response.data;
      else if (err.response.data.message) message = err.response.data.message;
      else if (err.response.data.error) message = err.response.data.error;
    }

    toast.error(message);
  });
};




// ================= REGISTER =================
const handleRegister = () => {

  // if (!name.trim()) return toast.error("Please enter your full name");
  if (!isValidName(name))
  return toast.error(
    "Name must be at least 5 characters and contain only alphabets"
  );
  if (!newPass.trim() || !confirmPass.trim())
    return toast.error("Please fill both password fields");

  if (!isValidPassword(newPass))
    return toast.error("Password must be 6–11 chars, include uppercase, lowercase, number & special character");

  if (newPass !== confirmPass)
    return toast.error("Password and Confirm Password do not match");

  axios.post(
    "http://localhost:9090/auth/complete-signup",
    { email: signupEmail, name:name, password: newPass, signupToken: localStorage.getItem("signupToken")},
    { headers: { "Content-Type": "application/json" } }
  )

  .then(() => {
    axios.post(
      "http://localhost:9091/users/create-user-account",
      { email: signupEmail, name:name },
      { headers: { "Content-Type": "application/json" } }
    )

    .then(() => {
      toast.success("Account Created Successfully!");
      setMode("login");
  setStep(1);
    })

    .catch(err => {
      console.error(err);
      let message = "Signup failed User Side";

      if (err.response?.data?.message) message = err.response.data.message;
      else if (err.response?.data?.error) message = err.response.data.error;
      else if (typeof err.response?.data === "string") message = err.response.data;

      toast.error(message);
    });
    
  })

  .catch(err => {
    console.error(err);

    let message = "Signup failed";

    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.response?.data?.error) message = err.response.data.error;
    else if (typeof err.response?.data === "string") message = err.response.data;

    toast.error(message);
  });
};




// ================= UI (UNCHANGED) =================
return (
  <div className="auth-overlay">
    <div className="auth-drawer">

      <span className="auth-close" onClick={handleClose}>✕</span>

      <div className="drawer-header">
        <img src="loginlogo.png" alt="logo" style={{width:"40%"}} />
        <h3>Foodie</h3>
        <p>Premium Food Experience</p>
      </div>

      {/* ------ your existing UI remains EXACTLY same below ------ */}
      {/* I did not change UI code at all */}
      {/* Only logic above was updated */}
      

      {/* === LOGIN === */}
      {mode === "login" &&  (
        <>
          <h2 className="auth-title">Login</h2>

          <p className="auth-sub">
            Don’t have an account?
            <span className="link" onClick={() => setMode("signup")}>
              Create Account
            </span>
          </p>

          <hr />

          <div className="auth-input">
            <input 
              type="email"
              placeholder="Enter Email"
              value={loginEmail}
              onChange={(e)=>setLoginEmail(e.target.value)}
            />
          </div>

          <div className="auth-input">
            <input 
              type="password"
              placeholder="Enter Password"
              value={loginPass}
              onChange={(e)=>setLoginPass(e.target.value)}
            />
          </div>

          <p className="auth-sub" style={{ textAlign: "right" }}>
            <span className="link" onClick={() => setMode("forgot")}>
              Forgot Password?
            </span>
          </p>

          <button className="auth-btn small-btn" onClick={handleLogin}>
            LOGIN
          </button>

          
        </>
      )}

      

     

      {/* SIGNUP */}
        {mode === "signup" && step === 1 && (
          <>
            <h2>Create Account</h2>
            <input placeholder="Email" onChange={e => setSignupEmail(e.target.value)} />
            <button onClick={handleSendOtp}>SEND OTP</button>
          </>
        )}

        {mode === "signup" && step === 2 && (
          <>
            <h2>Verify OTP</h2>
            <div className="otp-box">
              {otp.map((d, i) => (
                <input key={i} maxLength={1} ref={el => otpRefs.current[i] = el}
                  onChange={e => handleOtpChange(e.target.value, i)} />
              ))}
            </div>
            <p>{!canResend ? formatTime() : "Resend OTP"}</p>
            <button onClick={handleVerifyOtp}>VERIFY</button>
          </>
        )}

        {mode === "signup" && step === 3 && (
          <>
            <h2>Complete Profile</h2>
            <input placeholder="Full Name" onChange={e => setName(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setNewPass(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPass(e.target.value)} />
            <button onClick={handleRegister}>REGISTER</button>
          </>
        )}

        {/* FORGOT */}
        {mode === "forgot" && (
          <>
            <h2>Forgot Password</h2>
            <input placeholder="Email" onChange={e => setForgotEmail(e.target.value)} />
            <button onClick={handleForgotPass}>SEND OTP</button>
          </>
        )}

        {/* RESET */}
        {mode === "reset" && (
          <>
            <h2>Reset Password</h2>
            <div className="otp-box">
              {otp.map((d, i) => (
                <input key={i} maxLength={1} ref={el => otpRefs.current[i] = el}
                  onChange={e => handleOtpChange(e.target.value, i)} />
              ))}
            </div>
            <input type="password" placeholder="New Password" onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />
            <button onClick={handleResetPass}>RESET</button>
          </>
        )}
      </div>
    </div>
    

  
);
}
