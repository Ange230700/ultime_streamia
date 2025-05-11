// src\app\contexts\VideoContext.tsx

"use client";
import { createContext } from "react";

export interface Video {
  video_id: number;
  video_title: string;
  video_description?: string;
  is_available: boolean;
  cover_image_data?: string;
  categories: {
    category_id: number;
    category_name: string;
  }[];
}

export interface VideoContextType {
  videos: Video[];
  loading: boolean;
  refreshVideos: () => Promise<void>;
}

export const VideoContext = createContext<VideoContextType>({
  videos: [],
  loading: true,
  refreshVideos: async () => {},
});
