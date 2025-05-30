// src\app\components\VideoCard.tsx

"use client";

import Image from "next/image";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import type { Video } from "@/app/contexts/VideoContext";
import { Skeleton } from "primereact/skeleton";
import { UserContext } from "@/app/contexts/UserContext";
import { makeDataImage } from "@/utils/makeDataImage";

export interface VideoCardProps {
  readonly video: Video & {
    readonly thumbnail?: string;
  };
  // readonly onPlay?: (video: Video) => void;
  readonly onAddToWatchlist?: (video: Video) => void;
  readonly onAddToFavorites?: (video: Video) => void;
  readonly onDetails?: (video: Video) => void;
  className?: string;
  loading?: boolean;
}

export default function VideoCard({
  video,
  // onPlay,
  onAddToWatchlist,
  onAddToFavorites,
  onDetails,
  className = "",
  loading = false,
}: Readonly<VideoCardProps>) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(video.thumbnail);
  const [isLoaded, setIsLoaded] = useState(!hasImage);
  const handleImageLoad = () => setIsLoaded(true);

  // if loading the <Image> ever errors, also consider it loaded
  const _handleError = () => {
    setImgError(true);
    setIsLoaded(true);
  };

  // Title or spinner
  const title = video.video_title;

  // Subtitle or spinner
  let subTitleContent: React.ReactNode;
  if (!video.is_available && !user) {
    subTitleContent = "Unavailable";
  } else {
    subTitleContent = video.is_available || user ? "Available" : "Unavailable";
  }

  // Header image or spinner/avatar
  let headerImageContent: React.ReactNode;
  if (!video.thumbnail || imgError) {
    headerImageContent = (
      <div className="flex aspect-video items-center justify-center rounded-t-lg">
        <Avatar icon="pi pi-image" size="xlarge" shape="circle" />
      </div>
    );
  } else {
    headerImageContent = (
      <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
        {!isLoaded && (
          <div className="absolute inset-0 z-30">
            <Skeleton width="100%" height="100%" className="h-full w-full" />
          </div>
        )}
        <Image
          alt={video.video_title}
          src={makeDataImage(video.thumbnail!)}
          unoptimized
          loader={({ src }) => src}
          fill
          className={`rounded-t-lg object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
          onError={_handleError}
          onLoad={handleImageLoad}
          loading="lazy"
        />
      </div>
    );
  }

  const header = (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      {headerImageContent}
      {!loading && !video.is_available && !user && (
        <div
          className="absolute inset-0 flex items-center justify-center opacity-90 backdrop-blur-3xl"
          style={{ backgroundColor: "var(--highlight-bg)" }}
        >
          <i className="pi pi-lock" style={{ fontSize: "3rem" }} />
        </div>
      )}
    </div>
  );

  // Footer buttons or spinners
  const footer = (
    <div className="flex justify-end gap-2 p-2">
      {
        <>
          {/* <Button
            icon="pi pi-play"
            className="p-button-rounded p-button-outlined"
            aria-label="Play"
            onClick={() => onPlay?.(video)}
          /> */}
          <Button
            icon="pi pi-heart"
            className="p-button-rounded p-button-outlined"
            aria-label="Add to Favorites"
            onClick={() => onAddToFavorites?.(video)}
          />
          <Button
            icon="pi pi-plus"
            className="p-button-rounded p-button-outlined"
            aria-label="Add to Watchlist"
            onClick={() => onAddToWatchlist?.(video)}
          />
          <Button
            icon="pi pi-list"
            className="p-button-rounded p-button-outlined"
            aria-label="video details"
            onClick={() =>
              onDetails
                ? onDetails(video)
                : router.push(`/videos/${video.video_id}`)
            }
          />
        </>
      }
    </div>
  );

  return (
    <div className={`flex justify-center p-2 ${className}`}>
      <div className="relative h-auto w-full sm:h-[528px] sm:w-[384px]">
        <Card
          title={title}
          subTitle={subTitleContent}
          header={header}
          footer={footer}
          className="h-full w-full"
        >
          {hasImage && !isLoaded && (
            <div
              className="absolute inset-0 z-30 overflow-hidden rounded-t-lg"
              style={{ backgroundColor: "var(--highlight-bg)" }}
            >
              <Skeleton width="100%" height="100%" shape="rectangle" />
            </div>
          )}
          {loading ? (
            <div
              className="absolute inset-0 z-30 overflow-hidden rounded-t-lg"
              style={{ backgroundColor: "var(--highlight-bg)" }}
            >
              <Skeleton width="100%" height="100%" shape="rectangle" />
            </div>
          ) : (
            <p className="line-clamp-3 text-sm sm:text-base">
              {video.video_description}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
