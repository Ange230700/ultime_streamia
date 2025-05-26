// src/app/videos/[videoId]/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { unwrapApi } from "@/utils/unwrapApi";
import http from "@/lib/http";
import type { ApiResponse } from "@/types/api-response";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import { useUser } from "@/app/hooks/useUser";
import { ToastContext } from "@/app/ClientLayout";

interface VideoDetails {
  video_id: number;
  video_title: string;
  video_description?: string;
  is_available: boolean;
  thumbnail?: string;
  categories: { category_id: number; category_name: string }[];
}

export default function VideoDetailsPage() {
  const { videoId } = useParams();
  const { user } = useUser();
  const showToast = useContext(ToastContext);
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      try {
        const res = await http.get<ApiResponse<VideoDetails>>(
          `/api/videos/${videoId}`,
        );
        const data = unwrapApi(res.data);
        setVideo(data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        showToast({
          severity: "error",
          summary: "Error loading video",
          detail: message,
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    }
    fetchVideo();
  }, [videoId, showToast]);

  if (loading) {
    return (
      <div className="my-auto flex h-full items-center justify-center p-4">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) return <p className="p-4 text-center">There was an error.</p>;

  // If video locked for visitors
  if (video && !video.is_available && !user) {
    return (
      <p className="p-4 text-center text-xl">
        This video is unavailable.{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>{" "}
        to access.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold">{video?.video_title}</h1>

      {/* Categories */}
      {video?.categories.length ? (
        <div className="flex flex-wrap gap-2">
          {video.categories.map((c) => (
            <Chip key={c.category_id} label={c.category_name} />
          ))}
        </div>
      ) : null}

      {/* Description */}
      <p className="mt-4 text-lg">
        {video?.video_description ?? "No description provided."}
      </p>

      {/* Thumbnail */}
      {video?.thumbnail && (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
          <Image
            src={`data:image/svg+xml;base64,${video.thumbnail}`}
            alt={video.video_title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          icon="pi pi-play"
          label="Play"
          onClick={() =>
            showToast({
              severity: "info",
              summary: "Playing",
              detail: video?.video_title ?? "",
              life: 3000,
            })
          }
        />
        <Button
          icon="pi pi-heart"
          label="Favorite"
          onClick={() =>
            showToast({
              severity: "success",
              summary: "Added to Favorites",
              detail: video?.video_title ?? "",
              life: 3000,
            })
          }
        />
        <Button
          icon="pi pi-plus"
          label="Watchlist"
          onClick={() =>
            showToast({
              severity: "success",
              summary: "Added to Watchlist",
              detail: video?.video_title ?? "",
              life: 3000,
            })
          }
        />
      </div>
    </div>
  );
}
