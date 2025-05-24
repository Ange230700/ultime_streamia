// next.config.ts

import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "setplex.com",
        port: "",
        pathname: "/blog/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
