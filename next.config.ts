import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  cacheComponents: true,
  partialPrefetching: true,
  async rewrites() {
    const backendURL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/+$/, "");
    return backendURL ? [{
      source: "/backend-api/:path*",
      destination: `${backendURL}/:path*`,
    }] : [];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
