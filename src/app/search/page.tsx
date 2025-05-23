// src\app\search\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { unwrapApi } from "@/utils/unwrapApi";
import type { ApiResponse } from "@/types/api-response";
import { Video } from "@/app/contexts/VideoContext";
import VideoCard from "@/app/components/VideoCard";
import { Skeleton } from "primereact/skeleton";

// Predefined stable keys for skeleton placeholders
const skeletonKeys = ["s1", "s2", "s3", "s4", "s5", "s6"];

export default function SearchResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query") ?? "";

  const [videos, setVideos] = useState<Video[]>([]);
  const [filtered, setFiltered] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get<
          ApiResponse<{ videos: Video[]; total: number }>
        >("/api/videos", { params: { offset: 0, limit: 100 } });
        const data = unwrapApi(res.data);
        setVideos(data.videos);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    setFiltered(videos.filter((v) => v.video_title.toLowerCase().includes(q)));
  }, [videos, query]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
        {skeletonKeys.map((key) => (
          <div
            key={key}
            className="flex h-auto w-full justify-center sm:h-[528px] sm:w-[384px]"
            style={{ backgroundColor: "var(--highlight-bg)" }}
          >
            <Skeleton width="100%" height="100%" shape="rectangle" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="p-4">Error: {error}</p>;
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        Search Results for “{query}”
      </h1>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard
              key={video.video_id}
              video={video}
              onPlay={() => router.push(`/videos/${video.video_id}`)}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl">No videos found.</p>
      )}
    </div>
  );
}
