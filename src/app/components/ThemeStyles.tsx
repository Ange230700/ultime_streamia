// src/app/components/ThemeStyles.tsx
"use client";

import React from "react";
import Head from "next/head";
import { useTheme } from "@/app/hooks/useTheme";

export default function ThemeStyles() {
  const { theme } = useTheme();
  return (
    <Head>
      <link
        key={theme}
        rel="stylesheet"
        href={`/themes/soho-${theme}/theme.css`}
      />
    </Head>
  );
}
