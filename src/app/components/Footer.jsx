// src\app\components\Footer.jsx

"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <p>
        Check out the source code on{" "}
        <Link
          href="https://github.com/Ange230700/ultime_streamia"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Link>
      </p>
    </footer>
  );
}
