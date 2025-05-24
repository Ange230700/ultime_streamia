// next.config.ts

import type { NextConfig } from "next";

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
