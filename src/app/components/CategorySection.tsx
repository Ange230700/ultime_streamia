// src/app/components/CategorySection.tsx

"use client";

import React from "react";
import { Carousel, CarouselResponsiveOption } from "primereact/carousel";
import { Skeleton } from "primereact/skeleton";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";
import SkeletonVideoCard from "@/app/components/SkeletonVideoCard";

export interface CategorySectionProps {
  title: string;
  videos: Video[];
  loading: boolean;
}

const responsiveOptions: CarouselResponsiveOption[] = [
  { breakpoint: "1400px", numVisible: 3, numScroll: 1 },
  { breakpoint: "1199px", numVisible: 2, numScroll: 1 },
  { breakpoint: "767px", numVisible: 1, numScroll: 1 },
];

// lift this out so it's not re-created on every render of <Home>
const videoItemTemplate = (video: Video) => (
  <div className="h-full p-2">
    <VideoCard
      className="h-full"
      video={video}
      loading={false}
      onPlay={() => console.log("Play", video.video_title)}
      onAddToWatchlist={() => console.log("Watchlist", video.video_title)}
      onAddToFavorites={() => console.log("Favorites", video.video_title)}
    />
  </div>
);

const placeholders: number[] = Array.from({ length: 6 }, (_, i) => i);

const skeletonItemTemplate = (index: number) => (
  <div className="h-full p-2" key={`skeleton-${index}`}>
    <SkeletonVideoCard className="h-full w-full" />
  </div>
);

const CategorySection: React.FC<CategorySectionProps> = ({
  title,
  videos,
  loading,
}) => {
  let content: React.ReactNode;

  if (loading) {
    content = (
      <Carousel
        value={placeholders}
        circular
        autoplayInterval={3000}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={skeletonItemTemplate}
        className="custom-carousel"
      />
    );
  } else if (videos.length > 0) {
    content = (
      <Carousel
        value={videos}
        circular
        autoplayInterval={3000}
        numVisible={3}
        numScroll={1}
        responsiveOptions={responsiveOptions}
        itemTemplate={videoItemTemplate}
        className="custom-carousel"
      />
    );
  } else {
    content = (
      <p className="text-500 text-center text-2xl">
        No videos in this category.
      </p>
    );
  }

  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-semibold">
        {loading ? <Skeleton className="mb-2 h-6 w-1/4" /> : title}
      </h2>
      {content}
    </section>
  );
};

export default CategorySection;
