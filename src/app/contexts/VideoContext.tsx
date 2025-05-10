// src\app\contexts\VideoContext.tsx

"use client";
import { createContext } from "react";

export interface Video {
  video_id: number;
  video_title: string;
  video_description?: string;
  is_available: boolean;
}

export interface VideoContextType {
  movies: Video[];
  refreshMovies: () => Promise<void>;
}

export const VideoContext = createContext<VideoContextType>({
  movies: [],
  refreshMovies: async () => {},
});
