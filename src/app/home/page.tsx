// src\app\home\page.tsx

"use client";

import React, { useState } from "react";
import { useVideos } from "@/app/hooks/useVideos";
import VideoCard from "@/app/components/VideoCard";
import SkeletonVideoCard from "@/app/components/SkeletonVideoCard";
import type { Video } from "@/app/contexts/VideoContext";

export default function HomePage() {
  const { videos, loading } = useVideos();

  const skeletonCount = 6;

  const [skeletonIds] = useState<string[]>(() =>
    Array.from({ length: skeletonCount }, () => crypto.randomUUID()),
  );

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
    <div className="grid grid-cols-1 justify-items-center gap-4 px-2 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? // Render skeleton placeholders
          skeletonIds.map((id: string) => (
            <SkeletonVideoCard className="mx-2 sm:mx-0" key={id} />
          ))
        : // Render actual video cards
          videos.map((video: Video) => (
            <VideoCard
              key={video.video_id}
              video={video}
              onPlay={playVideo}
              onAddToWatchlist={addToWatchlist}
              onAddToFavorites={addToFavorites}
              className="mx-2 sm:mx-0"
            />
          ))}
    </div>
  );
}
