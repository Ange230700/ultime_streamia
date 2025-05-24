// src\app\search\page.tsx

export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SearchResultClient from "@/app/search/SearchResultClient";

export default async function Page({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ query?: string }>;
}>) {
  const { query } = await searchParams;
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        Search Results for “{query ?? ""}”
      </h1>
      <Suspense fallback={<p>Loading search results…</p>}>
        <SearchResultClient />
      </Suspense>
    </div>
  );
}
