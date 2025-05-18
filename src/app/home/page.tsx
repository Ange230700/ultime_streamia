// src\app\home\page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { CategoryContext } from "@/app/contexts/CategoryContext";
import { Video } from "@/app/contexts/VideoContext";
import CategorySection from "@/app/components/CategorySection";
import { ProgressSpinner } from "primereact/progressspinner";

export default function Home() {
  const { categories } = useContext(CategoryContext);

  // Store per-category videos and loading states
  const [videosByCategory, setVideosByCategory] = useState<
    Record<number, Video[]>
  >({});
  const [loadingByCategory, setLoadingByCategory] = useState<
    Record<number, boolean>
  >({});

  // Fetch per-category videos
  useEffect(() => {
    categories.forEach((cat) => {
      const catId = cat.category_id;
      // Set this category as loading
      setLoadingByCategory((prev) => ({ ...prev, [catId]: true }));

      axios
        .get<{ videos: Video[]; total: number }>(
          `/api/categories/${catId}/videos`,
          { params: { offset: 0, limit: 10 } },
        )
        .then((res) => {
          setVideosByCategory((prev) => ({
            ...prev,
            [catId]: res.data.videos,
          }));
        })
        .catch((err) => {
          console.error(`Failed to load videos for ${cat.category_name}`, err);
        })
        .finally(() => {
          setLoadingByCategory((prev) => ({ ...prev, [catId]: false }));
        });
    });
  }, [categories]);

  // Determine if any category is still loading
  const isAnyLoading = categories.some(
    (cat) => loadingByCategory[cat.category_id],
  );

  // Show a global spinner while any category data is loading
  if (isAnyLoading) {
    return (
      <div className="flex h-full items-center justify-center py-8">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-12 p-4">
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
