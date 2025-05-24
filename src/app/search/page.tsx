// src\app\search\page.tsx

"use client";

export const dynamic = "force-dynamic";

import React, { Suspense } from "react";
import SearchResultClient from "./SearchResultClient";

export default function Page({
  searchParams,
}: Readonly<{
  searchParams: { query?: string };
}>) {
  // pull query on the server and pass down if you like,
  // or let the client hook handle it inside the client component
  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-semibold">
        Search Results for “{searchParams.query ?? ""}”
      </h1>
      <Suspense fallback={<p>Loading search results…</p>}>
        <SearchResultClient />
      </Suspense>
    </div>
  );
}
