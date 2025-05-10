// src\app\hooks\useCategories.tsx

"use client";

import { useContext } from "react";
import { CategoryContext } from "@/app/contexts/CategoryContext";

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
