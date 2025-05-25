// src/app/videos/[videoId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { unwrapApi } from "@/utils/unwrapApi";
import http from "@/lib/http";
import type { ApiResponse } from "@/types/api-response";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";
import { Button } from "primereact/button";

export default function VideoDetailsPage() {
  const { videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      try {
        const res = await http.get<ApiResponse<Video>>(
          `/api/videos/${videoId}`,
        );
        const data = unwrapApi(res.data);
        setVideo(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [videoId]);

  if (loading) return <p className="p-4 text-center">Loading video details…</p>;
  if (error) return <p className="p-4 text-center">Error: {error}</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Reuse your VideoCard for the hero */}
      <VideoCard video={video!} className="shadow-lg" />

      <div>
        <h1 className="text-3xl font-bold">{video!.video_title}</h1>
        {video!.categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {video!.categories.map((c) => (
              <span
                key={c.category_id}
                className="bg-primary rounded-full px-3 py-1 text-sm font-medium"
              >
                {c.category_name}
              </span>
            ))}
          </div>
        )}
        <p className="mt-4">
          {video!.video_description ?? "No description provided."}
        </p>
      </div>

      {/* Placeholder for comments, favorites, etc. */}
      <div className="flex gap-4">
        <Button
          icon="pi pi-play"
          label="Play"
          onClick={() => console.log("▶️ Play")}
        />
        <Button
          icon="pi pi-heart"
          label="Favorite"
          onClick={() => console.log("❤️ Favorite")}
        />
        <Button
          icon="pi pi-plus"
          label="Watchlist"
          onClick={() => console.log("➕ Watchlist")}
        />
      </div>
    </div>
  );
}
