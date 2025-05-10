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

  return (
    <div className="grid-nogutter grid gap-4">
      {videos.map((video) => (
        <VideoCard
          key={video.video_id}
          video={video}
          onPlay={playVideo}
          onAddToWatchlist={addToWatchlist}
        />
      ))}
    </div>
  );
}
