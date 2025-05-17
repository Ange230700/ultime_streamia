// src\app\home\page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { ProgressSpinner } from "primereact/progressspinner";
import { CategoryContext } from "@/app/contexts/CategoryContext";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";

export default function Home() {
  const { categories } = useContext(CategoryContext);

  // Store per-category videos and loading states
  const [videosByCategory, setVideosByCategory] = useState<
    Record<number, Video[]>
  >({});
  const [loadingByCategory, setLoadingByCategory] = useState<
    Record<number, boolean>
  >({});

  // Fetch per-category videos
  useEffect(() => {
    categories.forEach((cat) => {
      const catId = cat.category_id;
      // Set this category as loading
      setLoadingByCategory((prev) => ({ ...prev, [catId]: true }));

      axios
        .get<{ videos: Video[]; total: number }>(
          `/api/categories/${catId}/videos`,
          { params: { offset: 0, limit: 10 } },
        )
        .then((res) => {
          setVideosByCategory((prev) => ({
            ...prev,
            [catId]: res.data.videos,
          }));
        })
        .catch((err) => {
          console.error(`Failed to load videos for ${cat.category_name}`, err);
        })
        .finally(() => {
          setLoadingByCategory((prev) => ({ ...prev, [catId]: false }));
        });
    });
  }, [categories]);

  const responsiveOptions: CarouselResponsiveOption[] = [
    { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
    { breakpoint: "1199px", numVisible: 2, numScroll: 1 },
    { breakpoint: "767px", numVisible: 1, numScroll: 1 },
  ];

  return (
    <div className="space-y-12 p-4">
      {categories.map((cat) => {
        const catId = cat.category_id;
        const vids = videosByCategory[catId] || [];
        const isLoading = loadingByCategory[catId] || false;

        // Extracted content logic
        let categoryContent: React.ReactNode;
        if (isLoading) {
          categoryContent = (
            <div className="flex justify-center p-4">
              <ProgressSpinner />
            </div>
          );
        } else if (vids.length > 0) {
          categoryContent = (
            <Carousel
              value={vids}
              circular
              autoplayInterval={3000}
              numVisible={3}
              numScroll={1}
              responsiveOptions={responsiveOptions}
              itemTemplate={(video: Video) => (
                <div className="p-2">
                  <VideoCard
                    video={video}
                    loading={isLoading}
                    onPlay={() => console.log("Play", video.video_title)}
                    onAddToWatchlist={() =>
                      console.log("Watchlist", video.video_title)
                    }
                    onAddToFavorites={() =>
                      console.log("Favorites", video.video_title)
                    }
                  />
                </div>
              )}
              className="custom-carousel"
            />
          );
        } else {
          categoryContent = (
            <p className="text-500 text-center text-2xl">
              No videos in this category.
            </p>
          );
        }

        return (
          <section key={catId} className="space-y-2">
            <h2 className="text-2xl font-semibold">{cat.category_name}</h2>
            {categoryContent}
          </section>
        );
      })}
    </div>
  );
}
