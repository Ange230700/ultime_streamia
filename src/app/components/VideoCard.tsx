// src\app\components\VideoCard.tsx

"use client";

import Image from "next/image";
import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import type { Video } from "@/app/contexts/VideoContext";

export interface VideoCardProps {
  readonly video: Video & {
    readonly cover_image_data?: string;
  };
  readonly onPlay?: (video: Video) => void;
  readonly onAddToWatchlist?: (video: Video) => void;
  readonly onAddToFavorites?: (video: Video) => void;
}

export default function VideoCard({
  video,
  onPlay,
  onAddToWatchlist,
  onAddToFavorites,
}: Readonly<VideoCardProps>) {
  const header = video.cover_image_data ? (
    <div style={{ position: "relative", width: "100%", height: "200px" }}>
      <Image
        alt={video.video_title}
        src={`data:image/jpeg;base64,${video.cover_image_data}`}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-t-lg"
      />
    </div>
  ) : null;

  const footer = (
    <div className="flex justify-end gap-3">
      <Button
        icon="pi pi-play"
        className="p-button-rounded p-button-outlined"
        aria-label="Play"
        onClick={() => onPlay?.(video)}
      />
      <Button
        icon="pi pi-heart"
        className="p-button-rounded p-button-outlined ml-2"
        aria-label="Add to Favorites"
        onClick={() => onAddToFavorites?.(video)}
      />
      <Button
        icon="pi pi-plus"
        className="p-button-rounded p-button-outlined ml-2"
        aria-label="Add to Watchlist"
        onClick={() => onAddToWatchlist?.(video)}
      />
    </div>
  );

  return (
    <Card
      title={video.video_title}
      subTitle={!video.is_available ? "Unavailable" : undefined}
      header={header}
      footer={footer}
      className="mx-auto w-full md:max-w-sm"
    >
      <p className="m-0">{video.video_description}</p>
    </Card>
  );
}
