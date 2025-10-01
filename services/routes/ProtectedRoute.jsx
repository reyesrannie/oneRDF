import React from "react";
import { Navigate } from "react-router-dom";
import SystemAppBar from "../../components/custom/SystemAppBar";

const ProtectedRoute = ({ isAuthenticated, redirectPath = "/login" }) => {
  return isAuthenticated ? (
    <SystemAppBar />
  ) : (
    <Navigate to={redirectPath} replace />
  );
};

export default ProtectedRoute;
