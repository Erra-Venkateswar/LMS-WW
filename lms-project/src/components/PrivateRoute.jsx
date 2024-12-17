import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  
  const token = localStorage.getItem("jwt_token");

  if (!token) {
    // If there's no token, redirect to the login page
    return <Navigate to="/login" />;
  }

  return element;
};

export default PrivateRoute;