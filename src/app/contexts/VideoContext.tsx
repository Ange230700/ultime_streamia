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
  totalCount: number;
  fetchVideos: (offset: number, limit: number) => Promise<Video[]>;
}

export const VideoContext = createContext<VideoContextType>({
  totalCount: 0,
  fetchVideos: async () => [],
});
