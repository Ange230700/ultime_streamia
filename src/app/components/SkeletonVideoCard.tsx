// src/app/components/SkeletonVideoCard.tsx
"use client";
import React from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import Image from "next/image";
import type { Video } from "@/app/contexts/VideoContext";

export interface SkeletonVideoCardProps {
  readonly video?: Video & {
    readonly cover_image_data?: string;
  };
  readonly className?: string;
}

export default function SkeletonVideoCard({
  video,
  className = "",
}: Readonly<SkeletonVideoCardProps>) {
  const hasImage = Boolean(video?.cover_image_data);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const handleImageLoad = () => setIsLoaded(true);

  const title = <Skeleton className="mb-2 h-6 w-3/4" />;

  const subTitle = <Skeleton className="mb-2 h-4 w-1/2" />;

  // Header image or spinner/avatar
  const headerImageContent: React.ReactNode = (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      {!isLoaded && (
        <div className="absolute inset-0 z-30">
          <Skeleton width="100%" height="100%" className="h-full w-full" />
        </div>
      )}
      <Image
        alt={video?.video_title ?? ""}
        src={`data:image/jpeg;base64,${video?.cover_image_data ?? ""}`}
        fill
        className={`rounded-t-lg object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={handleImageLoad}
        loading="lazy"
      />
    </div>
  );

  const header = (
    <div className="relative aspect-video w-full overflow-hidden rounded-t-lg">
      {headerImageContent}
    </div>
  );

  const footer = (
    <div className="flex justify-end gap-2 p-2">
      <Skeleton shape="circle" size="3rem" className="mr-2" />
      <Skeleton shape="circle" size="3rem" className="mr-2" />
      <Skeleton shape="circle" size="3rem" className="mr-2" />
    </div>
  );

  return (
    <Card
      title={title}
      subTitle={subTitle}
      header={header}
      footer={footer}
      className={`${className} relative w-full md:max-w-sm`}
    >
      {hasImage && !isLoaded && (
        <div
          className="absolute inset-0 z-30 overflow-hidden rounded-t-lg"
          style={{ backgroundColor: "var(--highlight-bg)" }}
        >
          <Skeleton width="100%" height="100%" className="h-full w-full" />
        </div>
      )}
    </Card>
  );
}
