import type { NextConfig } from "next";

// Base path for GitHub Pages deployment
// Set NEXT_PUBLIC_BASE_PATH="/portfolio-website" for project pages
// Leave empty or unset for custom domain / root deploy
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: "export",

  // Base path for GitHub Pages (e.g., "/portfolio-website" for project pages)
  // Leave empty for custom domain deployment
  basePath: basePath,

  // Asset prefix should match basePath for proper asset loading
  assetPrefix: basePath,

  // Required for static export with Next.js Image component
  images: {
    unoptimized: true,
  },

  // Ensure trailing slashes for GitHub Pages compatibility
  trailingSlash: true,
};

export default nextConfig;
