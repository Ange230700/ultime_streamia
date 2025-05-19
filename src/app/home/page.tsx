// src\app\home\page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CategoryContext } from "@/app/contexts/CategoryContext";
import { Video } from "@/app/contexts/VideoContext";
import CategorySection from "@/app/components/CategorySection";
import type { ApiResponse } from "@/types/api-response";
import { unwrapApi } from "@/utils/unwrapApi";

export default function Home() {
  const { categories } = useContext(CategoryContext);

  // Store per-category videos and loading states
  const [videosByCategory, setVideosByCategory] = useState<
    Record<number, Video[]>
  >({});
  const [loadingByCategory, setLoadingByCategory] = useState<
    Record<number, boolean>
  >({});

  const loadCategoryVideos = async (catId: number) => {
    setLoadingByCategory((prev) => ({ ...prev, [catId]: true }));
    try {
      const res = await axios.get<
        ApiResponse<{ videos: Video[]; total: number }>
      >(`/api/categories/${catId}/videos`, {
        params: { offset: 0, limit: 10 },
      });
      const data = unwrapApi(res.data);
      setVideosByCategory((prev) => ({
        ...prev,
        [catId]: data.videos,
      }));
    } catch (err) {
      console.error(`Failed to load videos for category ${catId}`, err);
    } finally {
      setLoadingByCategory((prev) => ({ ...prev, [catId]: false }));
    }
  };

  useEffect(() => {
    categories.forEach((cat) => {
      loadCategoryVideos(cat.category_id);
    });
  }, [categories]);

  return (
    <div className="flex-1 space-y-12 p-4">
      {categories.map((cat) => (
        <CategorySection
          key={cat.category_id}
          title={cat.category_name}
          videos={videosByCategory[cat.category_id] || []}
          loading={loadingByCategory[cat.category_id] || false}
        />
      ))}
    </div>
  );
}
