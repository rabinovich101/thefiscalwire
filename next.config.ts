import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder images for development/seed data
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      // UploadThing for user uploads
      {
        protocol: "https",
        hostname: "*.uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      // Common news image CDNs
      {
        protocol: "https",
        hostname: "*.newsdata.io",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      // Allow other HTTPS sources for news aggregation (more restrictive than **)
      {
        protocol: "https",
        hostname: "*.com",
      },
      {
        protocol: "https",
        hostname: "*.net",
      },
      {
        protocol: "https",
        hostname: "*.org",
      },
      {
        protocol: "https",
        hostname: "*.io",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
