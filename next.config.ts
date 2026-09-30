import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // As fotos hoje são locais (public/images). Quando vierem de um CDN/DAM,
    // declare o host aqui.
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
