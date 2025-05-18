// src\app\components\VideoCard.tsx

"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { ProgressSpinner } from "primereact/progressspinner";
import type { Video } from "@/app/contexts/VideoContext";

export interface VideoCardProps {
  readonly video: Video & {
    readonly cover_image_data?: string;
  };
  readonly onPlay?: (video: Video) => void;
  readonly onAddToWatchlist?: (video: Video) => void;
  readonly onAddToFavorites?: (video: Video) => void;
  className?: string;
  loading?: boolean;
}

export default function VideoCard({
  video,
  onPlay,
  onAddToWatchlist,
  onAddToFavorites,
  className = "",
  loading = false,
}: Readonly<VideoCardProps>) {
  const [imgError, setImgError] = useState(false);
  const hasImage = Boolean(video.cover_image_data);
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
  if (!video.is_available) {
    subTitleContent = "Unavailable";
  } else {
    subTitleContent = "Available";
  }

  // Header image or spinner/avatar
  let headerImageContent: React.ReactNode;
  if (!video.cover_image_data || imgError) {
    headerImageContent = (
      <div className="flex aspect-video items-center justify-center rounded-t-lg">
        <Avatar icon="pi pi-image" size="xlarge" shape="circle" />
      </div>
    );
  } else {
    headerImageContent = (
      <div className="relative aspect-video w-full">
        <Image
          alt={video.video_title}
          src={`data:image/jpeg;base64,${video.cover_image_data}`}
          fill
          className="rounded-t-lg object-cover"
          onError={_handleError}
          onLoad={handleImageLoad}
        />
      </div>
    );
  }

  const header = (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      {headerImageContent}
      {!loading && !video.is_available && (
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
          <Button
            icon="pi pi-play"
            className="p-button-rounded p-button-outlined"
            aria-label="Play"
            onClick={() => onPlay?.(video)}
          />
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
        </>
      }
    </div>
  );

  return (
    <Card
      title={title}
      subTitle={subTitleContent}
      header={header}
      footer={footer}
      className={`${className} relative w-full md:max-w-sm`}
    >
      {hasImage && !isLoaded && (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center rounded-lg py-4"
          style={{ backgroundColor: "var(--highlight-bg)" }}
        >
          <ProgressSpinner />
        </div>
      )}
      {loading ? (
        <div
          className="absolute inset-0 z-30 flex items-center justify-center rounded-lg py-4"
          style={{ backgroundColor: "var(--highlight-bg)" }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <p className="line-clamp-3 text-sm sm:text-base">
          {video.video_description}
        </p>
      )}
    </Card>
  );
}
