// src\app\home\page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  VirtualScroller,
  VirtualScrollerLazyEvent,
  VirtualScrollerTemplateOptions,
} from "primereact/virtualscroller";
import { Skeleton } from "primereact/skeleton";
import { useVideos } from "@/app/hooks/useVideos";
import VideoCard from "@/app/components/VideoCard";
import type { Video } from "@/app/contexts/VideoContext";

const itemSize = 300;

function renderItem(
  video: Video | undefined,
  options: VirtualScrollerTemplateOptions,
) {
  const style = { height: options.props.itemSize + "px" };
  if (!video) {
    return (
      <div
        className={`align-items-center flex p-2 ${
          options.odd ? "surface-hover" : ""
        }`}
        style={style}
      >
        <Skeleton width={options.even ? "60%" : "50%"} height="1.3rem" />
      </div>
    );
  }

  return (
    <div className="p-2" style={style}>
      <VideoCard
        video={video}
        onPlay={() => console.log("Play", video.video_title)}
        onAddToWatchlist={() => console.log("Watchlist", video.video_title)}
        onAddToFavorites={() => console.log("Favorites", video.video_title)}
        className="w-full"
      />
    </div>
  );
}

export default function HomePage() {
  const { totalCount, fetchVideos } = useVideos();
  const [items, setItems] = useState<(Video | undefined)[]>([]);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(Array.from({ length: totalCount }));
    setLoading(false);
  }, [totalCount]);

  const loadAndSet = async (offset: number, limit: number) => {
    const videos = await fetchVideos(offset, limit);
    setItems((prev) => {
      const updated = [...prev];
      for (let i = 0; i < videos.length; i++) {
        updated[offset + i] = videos[i];
      }
      return updated;
    });
    setLoading(false);
  };

  const onLazyLoad = (e: VirtualScrollerLazyEvent) => {
    setLoading(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const { first, last } = e;
    timeoutRef.current = setTimeout(
      () => loadAndSet(Number(first), Number(last) - Number(first)),
      200,
    );
  };

  return (
    <div className="card justify-content-center flex">
      <VirtualScroller
        items={items}
        itemSize={itemSize}
        lazy
        onLazyLoad={onLazyLoad}
        itemTemplate={renderItem}
        showLoader
        loading={loading}
        className="surface-border border-round border-1"
        style={{ width: "100%", height: "80vh" }}
      />
    </div>
  );
}
