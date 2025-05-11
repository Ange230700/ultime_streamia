// src\app\home\page.tsx

"use client";

import React from "react";
import { useVideos } from "@/app/hooks/useVideos";
import VideoCard from "@/app/components/VideoCard";
import type { Video } from "@/app/contexts/VideoContext";

export default function HomePage() {
  const { videos } = useVideos();

  const playVideo = (video: Video) => {
    console.log("Play", video.video_title);
  };
  const addToWatchlist = (video: Video) => {
    console.log("Add to watchlist", video.video_title);
  };
  const addToFavorites = (video: Video) => {
    console.log("Add to favorites", video.video_title);
  };

  return (
    <div className="grid grid-cols-1 gap-4 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video) => (
        <VideoCard
          key={video.video_id}
          video={video}
          onPlay={playVideo}
          onAddToWatchlist={addToWatchlist}
          onAddToFavorites={addToFavorites}
        />
      ))}
    </div>
  );
}
