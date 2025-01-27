import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{ hostname: "images.unsplash.com" }],
  },
  reactStrictMode: false,
  output: "standalone",
};

export default nextConfig;
