// src/app/components/CategorySection.tsx

"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Skeleton } from "primereact/skeleton";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";
import { ToastContext } from "@/app/ClientLayout";

export interface CategorySectionProps {
  title: string;
  videos: Video[];
  loading: boolean;
}

const responsiveOptions: CarouselResponsiveOption[] = [
  { breakpoint: "1199px", numVisible: 2, numScroll: 1 },
  { breakpoint: "767px", numVisible: 1, numScroll: 1 },
];

const placeholders: number[] = Array.from({ length: 6 }, (_, i) => i);

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  videos,
  loading,
}) => {
  const router = useRouter();
  // Move useContext into component
  const showToast = useContext(ToastContext);

  // Only show available videos to visitors; logged-in users see all
  const videosToDisplay = videos;

  // Define template here to use showToast
  const videoItemTemplate = (video: Video) => (
    <div className="flex justify-center p-2">
      <VideoCard
        className="h-full"
        video={video}
        loading={false}
        onPlay={() =>
          showToast({
            severity: "info",
            summary: "Playing",
            detail: video.video_title,
            life: 3000,
          })
        }
        onAddToWatchlist={() =>
          showToast({
            severity: "success",
            summary: "Watchlist",
            detail: `${video.video_title} added`,
            life: 3000,
          })
        }
        onAddToFavorites={() =>
          showToast({
            severity: "success",
            summary: "Favorites",
            detail: `${video.video_title} added`,
            life: 3000,
          })
        }
        onDetails={() => router.push(`/videos/${video.video_id}`)}
      />
    </div>
  );

  const loadingItemTemplate = (index: number) => (
    <div className="flex justify-center p-2">
      <div
        key={`skeleton-${index}`}
        className="flex h-auto w-full justify-center sm:h-[528px] sm:w-[384px]"
        style={{ backgroundColor: "var(--highlight-bg)" }}
      >
        <Skeleton width="100%" height="100%" shape="rectangle" />
      </div>
    </div>
  );

  let content: React.ReactNode;

  if (loading) {
    content = (
      <Carousel
        value={placeholders}
        circular
        autoplayInterval={7000}
        numVisible={2}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={loadingItemTemplate}
        className="custom-carousel"
      />
    );
  } else if (videosToDisplay.length > 0) {
    content = (
      <Carousel
        value={videosToDisplay}
        circular
        autoplayInterval={7000}
        numVisible={2}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={videoItemTemplate}
        className="custom-carousel"
      />
    );
  } else {
    content = (
      <p className="text-500 h-130 text-center text-4xl">
        No videos in this category.
      </p>
    );
  }

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {content}
    </section>
  );
};

export default CategorySection;
