// src\app\components\VideoCard.tsx

"use client";

import Image from "next/image";
import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import type { Video } from "@/app/contexts/VideoContext";

export interface VideoCardProps {
  readonly video: Video & {
    readonly cover_image_data?: string;
  };
  readonly onPlay?: (video: Video) => void;
  readonly onAddToWatchlist?: (video: Video) => void;
  readonly onAddToFavorites?: (video: Video) => void;
  className?: string;
}

export default function VideoCard({
  video,
  onPlay,
  onAddToWatchlist,
  onAddToFavorites,
  className = "",
}: Readonly<VideoCardProps>) {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  const header =
    !video.cover_image_data || imgError ? (
      <div className="flex aspect-video items-center justify-center rounded-t-lg">
        <Avatar icon="pi pi-image" size="xlarge" shape="circle" />
      </div>
    ) : (
      <div className="relative aspect-video w-full">
        <Image
          alt={video.video_title}
          src={`data:image/jpeg;base64,${video.cover_image_data}`}
          fill
          className="rounded-t-lg object-cover"
          onError={handleError}
        />
      </div>
    );

  const footer = (
    <div className="flex justify-end gap-2 p-2">
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
    </div>
  );

  return (
    <Card
      title={video.video_title}
      subTitle={!video.is_available ? "Unavailable" : "Available"}
      header={header}
      footer={footer}
      className={`${className} w-full md:max-w-sm`}
    >
      <p className="line-clamp-3 text-sm sm:text-base">
        {video.video_description}
      </p>
    </Card>
  );
}
