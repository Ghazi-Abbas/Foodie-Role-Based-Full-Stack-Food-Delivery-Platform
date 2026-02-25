import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const token = localStorage.getItem("token");

  // LOAD USER WHEN APP OPENS/REFRESHES
  useEffect(() => {
    if (!token) return;

    axios.get("http://localhost:9091/users/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setUser(res.data);
      setIsLoggedIn(true);
      localStorage.setItem("user", JSON.stringify(res.data));
    })
    .catch(() => {
      localStorage.clear();
      setIsLoggedIn(false);
      setUser(null);
    });
  }, []);

  // LOGIN FUNCTION
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(userData));

    setIsLoggedIn(true);
    setUser(userData);
    window.dispatchEvent(new Event("auth-change"));
  };

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
