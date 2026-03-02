import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const baseConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

/** @type {import('next').NextConfig} */
export default function nextConfig(phase) {
  return {
    ...baseConfig,
    // Keep dev and production build artifacts separate to avoid chunk/manifest corruption.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
