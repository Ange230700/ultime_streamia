// src/app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import React from "react";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-4xl font-bold">403 – Unauthorized</h1>
        <p className="mb-6">You don’t have permission to view this page.</p>
        <Link href="/" className="text-primary underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}
