// src\app\components\Footer.tsx

"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="p-4 text-center text-2xl"
      style={{ backgroundColor: "var(--surface-section)" }}
    >
      <div className="flex items-center justify-center gap-2">
        <span>Check out the source code on</span>
        <Link
          href="https://github.com/Ange230700/ultime_streamia"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold hover:underline"
        >
          GitHub
        </Link>
      </div>
    </footer>
  );
}
