// src\app\hooks\useMovies.tsx

"use client";

import { useContext } from "react";
import { VideoContext } from "@/app/contexts/VideoContext";

export function useMovies() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useMovies must be used within a MovieProvider");
  }
  return context;
}
