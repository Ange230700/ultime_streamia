// src\app\home\page.tsx

"use client";

import React from "react";
import { useVideos } from "@/app/hooks/useVideos";
import VideoCard from "@/app/components/VideoCard";
import type { Video } from "@/app/contexts/VideoContext";

export default function HomePage() {
  const { videos, loading } = useVideos();

  const playVideo = (video: Video) => {
    console.log("Play", video.video_title);
  };
  const addToWatchlist = (video: Video) => {
    console.log("Add to watchlist", video.video_title);
  };
  const addToFavorites = (video: Video) => {
    console.log("Add to favorites", video.video_title);
  };

  if (loading) {
    return (
      <div className="grid flex-1 grid-cols-1 justify-items-center gap-4 px-2 py-8">
        <i
          className="pi pi-spin pi-spinner animate-spin place-self-center"
          style={{ fontSize: "5rem" }}
        />
      </div>
    );
  }

  return (
    <div className="grid flex-1 grid-cols-1 justify-items-center gap-4 px-2 py-8 sm:grid-cols-2 lg:grid-cols-3">
      {videos.map((video: Video) => (
        <VideoCard
          key={video.video_id}
          video={video}
          onPlay={playVideo}
          onAddToWatchlist={addToWatchlist}
          onAddToFavorites={addToFavorites}
          className="mx-2 sm:mx-0"
          loading={loading}
        />
      ))}
    </div>
  );
}
