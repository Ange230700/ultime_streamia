// src/app/components/SkeletonVideoCard.tsx
"use client";
import React from "react";
import { Skeleton } from "primereact/skeleton";

export default function SkeletonVideoCard() {
  return (
    <div className="mx-2 w-full sm:mx-0 md:max-w-sm">
      <div className="border-round surface-border surface-card border-1 p-4">
        <Skeleton width="100%" height="180px" className="mb-3" />
        <Skeleton width="60%" className="mb-2" />
        <Skeleton width="40%" className="mb-2" />
        <div className="mt-3 flex justify-end gap-2">
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="2rem" height="2rem" />
          <Skeleton width="2rem" height="2rem" />
        </div>
      </div>
    </div>
  );
}
