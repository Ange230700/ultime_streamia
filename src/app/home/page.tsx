// src\app\home\page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { CategoryContext } from "@/app/contexts/CategoryContext";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";

export default function Home() {
  const { categories } = useContext(CategoryContext);

  // Per-category videos for Carousels
  const [videosByCategory, setVideosByCategory] = useState<
    Record<number, Video[]>
  >({});

  // Fetch per-category videos
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

  const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 2, numScroll: 1 },
    { breakpoint: "767px", numVisible: 1, numScroll: 1 },
  ];

  const videoItemTemplate = (video: Video) => (
    <div className="p-2">
      <VideoCard
        video={video}
        onPlay={() => console.log("Play", video.video_title)}
        onAddToWatchlist={() => console.log("Watchlist", video.video_title)}
        onAddToFavorites={() => console.log("Favorites", video.video_title)}
        className="w-full"
      />
    </div>
  );

  return (
    <div className="space-y-12 p-4">
      {/* Category Carousels */}
      {categories.map((cat) => {
        const vids = videosByCategory[cat.category_id] || [];
        return (
          <section key={cat.category_id} className="space-y-2">
            <h2 className="text-2xl font-semibold">{cat.category_name}</h2>
            {vids.length > 0 ? (
              <Carousel
                value={vids}
                circular
                autoplayInterval={3000}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                itemTemplate={videoItemTemplate}
                className="custom-carousel"
              />
            ) : (
              <p className="text-500 text-sm">No videos in this category.</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
