// src\app\home\page.tsx

"use client";

import React from "react";
import { useVideos } from "@/app/hooks/useVideos";
import { useCategories } from "@/app/hooks/useCategories";
import VideoCard from "@/app/components/VideoCard";
import type { Category } from "@/app/contexts/CategoryContext";

export default function HomePage() {
  const { videos, loading } = useVideos();
  const { categories } = useCategories();

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
    <div className="flex-1 space-y-12 px-4 py-8">
      {categories.map((cat: Category) => {
        const vids = videos.filter((v) =>
          v.categories.some((c) => c.category_id === cat.category_id),
        );
        if (vids.length === 0) return null;

        return (
          <section key={cat.category_id}>
            <h2 className="mb-4 text-3xl font-semibold">{cat.category_name}</h2>
            <div className="grid grid-cols-1 justify-items-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vids.map((video) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  onPlay={() => console.log("Play", video.video_title)}
                  onAddToWatchlist={() =>
                    console.log("Watchlist", video.video_title)
                  }
                  onAddToFavorites={() =>
                    console.log("Favorites", video.video_title)
                  }
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
