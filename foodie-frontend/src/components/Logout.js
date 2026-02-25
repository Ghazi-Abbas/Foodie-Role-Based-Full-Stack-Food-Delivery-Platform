import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User logged out");
    navigate("/login");
  }, [navigate]);

  return <h3>Logging out...</h3>;
}

export default Logout;
