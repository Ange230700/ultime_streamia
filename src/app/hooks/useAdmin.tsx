// src\app\hooks\useAdmin.tsx

"use client";

import { useContext } from "react";
import { AdminContext } from "@/app/contexts/AdminContext";

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within a AdminProvider");
  }
  return context;
};
