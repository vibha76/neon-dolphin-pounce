"use client";

import React from "react";
import { Navigate } from "react-router-dom";
import { useFinance } from "@/context/FinanceContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userProfile } = useFinance();

  if (!userProfile) {
    // User is not authenticated, redirect to the auth page
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;