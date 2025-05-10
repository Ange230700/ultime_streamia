// src\app\hooks\useMovies.tsx

"use client";

import { useContext } from "react";
import { VideoContext } from "@/app/contexts/VideoContext";

export function useVideos() {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideos must be used within a VideoProvider");
  }
  return context;
}
