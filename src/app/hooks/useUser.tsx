// src\app\hooks\useUser.tsx

"use client";

import { useContext } from "react";
import { UserContext } from "@/app/contexts/UserContext";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
