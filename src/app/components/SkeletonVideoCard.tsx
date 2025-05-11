// src/app/components/SkeletonVideoCard.tsx
"use client";
import React from "react";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";

export interface SkeletonVideoCardProps {
  readonly className?: string;
}

export default function SkeletonVideoCard({
  className = "",
}: Readonly<SkeletonVideoCardProps>) {
  const title = <Skeleton className="mb-2 w-full" />;

  const subTitle = <Skeleton className="mb-2 w-full" />;

  const header = (
    <div className="relative aspect-video w-full rounded-t-lg">
      <Skeleton className="h-full w-full" />
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
      className={`${className} w-full md:max-w-sm`}
    >
      <div className="line-clamp-3 text-sm sm:text-base">
        <Skeleton className="mb-2 w-full" />
      </div>
    </Card>
  );
}
