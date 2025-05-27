// src/app/videos/[videoId]/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState, useContext } from "react";
import { unwrapApi } from "@/utils/unwrapApi";
import http from "@/lib/http";
import type { ApiResponse } from "@/types/api-response";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import { useUser } from "@/app/hooks/useUser";
import { useAdmin } from "@/app/hooks/useAdmin";
import { ToastContext } from "@/app/ClientLayout";

interface VideoDetails {
  video_id: number;
  video_title: string;
  video_description?: string;
  is_available: boolean;
  thumbnail?: string;
  video_data?: string;
  categories: { category_id: number; category_name: string }[];
}

export default function VideoDetailsPage() {
  const { videoId } = useParams();
  const { user } = useUser();
  const { adminView } = useAdmin();
  const showToast = useContext(ToastContext);
  const [video, setVideo] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    async function fetchVideo() {
      setLoading(true);
      setError(null);
      try {
        const res = await http.get<ApiResponse<VideoDetails>>(
          `/api/videos/${videoId}`,
        );
        const data = unwrapApi(res.data);
        setVideo(data);
        setVideoError(false);
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

    if (videoId) {
      fetchVideo();
    }
  }, [videoId, showToast]);

  if (loading) {
    return (
      <div className="my-auto flex h-full items-center justify-center p-4">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <p className="p-4 text-center">
        There was an error loading the video: {error}
      </p>
    );
  }

  // If video locked for visitors
  if (video && !video.is_available && !user) {
    return (
      <p className="my-auto p-4 text-center text-2xl">
        This video is unavailable.{" "}
        <Link href="/login" className="underline">
          Log in
        </Link>{" "}
        to access.
      </p>
    );
  }

  // Build the mediaContent variable
  let mediaContent: React.ReactNode;

  if (video?.video_data && !videoError) {
    mediaContent = (
      <div className="w-full">
        <video
          controls
          className="aspect-video w-full rounded-lg shadow-md"
          src={`data:video/mp4;base64,${video.video_data}`}
          onError={() => {
            setVideoError(true);
            showToast({
              severity: "error",
              summary: "Playback Error",
              detail: "Could not load video, showing thumbnail instead.",
              life: 4000,
            });
          }}
        >
          <track
            default
            kind="captions"
            src="/captions/en.vtt"
            srcLang="en"
            label="English"
          />
          Sorry, your browser doesn’t support embedded videos.
        </video>
      </div>
    );
  } else if (video?.thumbnail) {
    mediaContent = (
      <div
        className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md"
        style={{ backgroundColor: "var(--highlight-bg)" }}
      >
        {!videoError ? (
          <Image
            src={`data:image/svg+xml;base64,${video.thumbnail}`}
            alt={`${video.video_title} thumbnail"`}
            className="object-cover"
            fill
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ backgroundColor: "var(--highlight-bg)" }}
          >
            <Avatar icon="pi pi-video" size="xlarge" shape="circle" />
            <p>⚠️ Video failed to load</p>
          </div>
        )}
      </div>
    );
  } else {
    mediaContent = (
      <div className="p-4 text-center text-lg">
        No preview available for this video.
      </div>
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

      {/* Video or thumbnail */}
      {mediaContent}

      {/* Actions */}
      <div className="flex gap-4">
        {/* <Button
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
        /> */}
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

      {/* ─── Admin‐only controls ───────────────────────────────────────── */}
      {user?.is_admin && adminView && (
        <div className="flex gap-3">
          <Button
            icon="pi pi-pencil"
            label="Edit Video"
            onClick={() => {
              /* open your edit dialog or navigate */
            }}
          />
          <Button
            icon="pi pi-trash"
            label="Delete Video"
            severity="danger"
            onClick={() => {
              /* call delete API + refetch/list redirect */
            }}
          />
        </div>
      )}
    </div>
  );
}
