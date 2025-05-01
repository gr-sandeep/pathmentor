import React, { useEffect } from "react";
import securelocalstorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userInfo = securelocalstorage.getItem("userInfo");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  return userInfo ? children : null;
};

export default ProtectedRoute;
