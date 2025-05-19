// src\app\hooks\useTheme.tsx

import { useContext } from "react";
import { ThemeContext } from "@/app/contexts/ThemeContext";

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be inside ThemeProvider");
  return ctx;
}
