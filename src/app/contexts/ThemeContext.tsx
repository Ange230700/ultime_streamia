// src\app\contexts\ThemeContext.tsx

"use client";

import { createContext } from "react";
import { Theme } from "@/types/theme";

export interface ThemeContextType {
  theme: Theme;
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
