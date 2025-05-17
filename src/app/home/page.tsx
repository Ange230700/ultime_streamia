// src\app\home\page.tsx

"use client";

import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { DataScroller } from "primereact/datascroller";
import { Video } from "@/app/contexts/VideoContext";
import { CategoryContext } from "@/app/contexts/CategoryContext";
import VideoCard from "@/app/components/VideoCard";

export default function CategoryVideoScroller() {
  const { categories } = useContext(CategoryContext);
  const [videosByCategory, setVideosByCategory] = useState<
    Record<number, Video[]>
  >({});

  useEffect(() => {
    categories.forEach(async (cat) => {
      try {
        const res = await axios.get<{ videos: Video[]; total: number }>(
          `/api/categories/${cat.category_id}/videos`,
          { params: { offset: 0, limit: 10 } },
        );
        setVideosByCategory((prev) => ({
          ...prev,
          [cat.category_id]: res.data.videos,
        }));
      } catch (err) {
        console.error(`Failed to load videos for ${cat.category_name}`, err);
      }
    });
  }, [categories]);

  const videoTemplate = (video: Video) => (
    <div className="p-2">
      <VideoCard
        video={video}
        onPlay={() => console.log("Play", video.video_title)}
        onAddToWatchlist={() => console.log("Watchlist", video.video_title)}
        onAddToFavorites={() => console.log("Favorites", video.video_title)}
      />
    </div>
  );

  return (
    <div className="space-y-8">
      {categories.map((cat) => {
        const vids = videosByCategory[cat.category_id] || [];
        return (
          <section key={cat.category_id}>
            <h2 className="mb-2 text-2xl font-semibold">{cat.category_name}</h2>
            <DataScroller
              value={vids}
              itemTemplate={videoTemplate}
              rows={5}
              inline
              scrollHeight="300px"
              header={`More ${cat.category_name}`}
            />
          </section>
        );
      })}
    </div>
  );
}
