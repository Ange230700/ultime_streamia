// src/app/videos/[videoId]/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  ChangeEvent,
} from "react";
import { unwrapApi } from "@/utils/unwrapApi";
import http from "@/lib/http";
import type { ApiResponse } from "@/types/api-response";
import { Button } from "primereact/button";
import { Chip } from "primereact/chip";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useUser } from "@/app/hooks/useUser";
import { useAdmin } from "@/app/hooks/useAdmin";
import { ToastContext } from "@/app/ClientLayout";
import { makeDataImage } from "@/utils/makeDataImage";

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
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [editableTitle, setEditableTitle] = useState("");
  const [editableDesc, setEditableDesc] = useState("");
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);

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

  // Initialize edit form when opening
  function openEditDialog() {
    if (!video) return;
    setEditableTitle(video.video_title);
    setEditableDesc(video.video_description ?? "");
    setThumbPreview(
      video.thumbnail ? makeDataImage(video.thumbnail) : undefined,
    );
    setNewThumbnail(null);
    setIsEditVisible(true);
  }

  // Handle thumbnail file change
  function onThumbChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnail(file);
      setThumbPreview(URL.createObjectURL(file));
    }
  }

  // Save edits
  async function saveEdits() {
    if (!video) return;
    try {
      const form = new FormData();
      form.append("video_title", editableTitle);
      form.append("video_description", editableDesc);
      if (newThumbnail) form.append("thumbnail", newThumbnail);
      if (newVideoFile) form.append("video_data", newVideoFile);

      const res = await http.put<ApiResponse<VideoDetails>>(
        `/api/videos/${video.video_id}`,
        form,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      const updated = unwrapApi(res.data);
      setVideo(updated);
      showToast({
        severity: "success",
        summary: "Video Updated",
        detail: "Your changes have been saved.",
      });
      setIsEditVisible(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      showToast({
        severity: "error",
        summary: "Update Failed",
        detail: msg,
      });
    }
  }

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
        </video>
      </div>
    );
  } else if (video?.thumbnail) {
    mediaContent = (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-md">
        <Image
          src={makeDataImage(video.thumbnail)}
          alt="thumbnail"
          fill
          unoptimized
          className="object-cover"
        />
      </div>
    );
  } else {
    mediaContent = <p className="p-4 text-center">No preview available.</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold">{video?.video_title}</h1>

      {/* Categories */}
      {video?.categories && video.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {video.categories.map((c) => (
            <Chip key={c.category_id} label={c.category_name} />
          ))}
        </div>
      )}

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
            onClick={openEditDialog}
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

      {/* ─── Edit Dialog ────────────────────────────────────────────────── */}
      <Dialog
        header="Edit Video"
        visible={isEditVisible}
        style={{ width: "500px" }}
        modal
        onHide={() => setIsEditVisible(false)}
      >
        <div className="space-y-4">
          <label className="block font-medium">
            Title
            <InputText
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              className="w-full"
            />
          </label>

          <label className="block font-medium">
            Description
            <InputTextarea
              value={editableDesc}
              onChange={(e) => setEditableDesc(e.target.value)}
              className="w-full"
              rows={4}
            />
          </label>

          <label className="block font-medium">
            Thumbnail
            <div className="flex items-center gap-4">
              {thumbPreview && (
                <div className="relative aspect-video w-full overflow-hidden rounded">
                  <Image
                    src={thumbPreview}
                    alt="Preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              <Button
                label="Choose File"
                onClick={() => fileInputRef.current?.click()}
              />
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={onThumbChange}
              />
            </div>
          </label>

          <label className="block font-medium">
            Video File
            <div className="flex items-center gap-4">
              {newVideoFile && (
                <span className="text-sm italic">{newVideoFile.name}</span>
              )}
              <Button
                label="Choose Video"
                onClick={() => videoInputRef.current?.click()}
              />
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setNewVideoFile(file);
                }}
              />
            </div>
          </label>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button label="Cancel" text onClick={() => setIsEditVisible(false)} />
          <Button label="Save" icon="pi pi-check" onClick={saveEdits} />
        </div>
      </Dialog>
    </div>
  );
}
