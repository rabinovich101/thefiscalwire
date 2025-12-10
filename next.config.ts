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
        hostname: "uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "*.uploadthing.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      // NewsData.io images
      {
        protocol: "https",
        hostname: "newsdata.io",
      },
      {
        protocol: "https",
        hostname: "*.newsdata.io",
      },
      // Unsplash for stock images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // AWS/CloudFront CDNs (common for news sources)
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
      },
      // Common news source image CDNs
      {
        protocol: "https",
        hostname: "media.reuters.com",
      },
      {
        protocol: "https",
        hostname: "*.reuters.com",
      },
      {
        protocol: "https",
        hostname: "static.cnbcfm.com",
      },
      {
        protocol: "https",
        hostname: "image.cnbcfm.com",
      },
      {
        protocol: "https",
        hostname: "*.bloomberg.com",
      },
      {
        protocol: "https",
        hostname: "*.wsj.net",
      },
      {
        protocol: "https",
        hostname: "*.nytimes.com",
      },
      {
        protocol: "https",
        hostname: "*.ft.com",
      },
      {
        protocol: "https",
        hostname: "*.marketwatch.com",
      },
      {
        protocol: "https",
        hostname: "*.barrons.com",
      },
      {
        protocol: "https",
        hostname: "*.cnn.com",
      },
      {
        protocol: "https",
        hostname: "*.foxbusiness.com",
      },
      {
        protocol: "https",
        hostname: "*.yahoo.com",
      },
      {
        protocol: "https",
        hostname: "*.yimg.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      // Gravatar for user avatars
      {
        protocol: "https",
        hostname: "*.gravatar.com",
      },
      // TownNews CDN (local news sources)
      {
        protocol: "https",
        hostname: "*.townnews.com",
      },
      {
        protocol: "https",
        hostname: "bloximages.chicago2.vip.townnews.com",
      },
      // InvestorPlace and other financial news
      {
        protocol: "https",
        hostname: "investorplace.com",
      },
      {
        protocol: "https",
        hostname: "*.investorplace.com",
      },
      {
        protocol: "https",
        hostname: "*.benzinga.com",
      },
      {
        protocol: "https",
        hostname: "*.seekingalpha.com",
      },
      {
        protocol: "https",
        hostname: "*.fool.com",
      },
      {
        protocol: "https",
        hostname: "g.foolcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.foolcdn.com",
      },
      {
        protocol: "https",
        hostname: "*.thestreet.com",
      },
      {
        protocol: "https",
        hostname: "*.barrons.com",
      },
      {
        protocol: "https",
        hostname: "*.investopedia.com",
      },
      {
        protocol: "https",
        hostname: "*.marketbeat.com",
      },
      {
        protocol: "https",
        hostname: "www.marketbeat.com",
      },
      // PR Newswire
      {
        protocol: "https",
        hostname: "*.prnewswire.com",
      },
      {
        protocol: "https",
        hostname: "mma.prnewswire.com",
      },
      // GlobeNewswire
      {
        protocol: "https",
        hostname: "*.globenewswire.com",
      },
      // Business Wire
      {
        protocol: "https",
        hostname: "*.businesswire.com",
      },
      // YouTube thumbnails (for video embedding)
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
      // Vimeo thumbnails
      {
        protocol: "https",
        hostname: "i.vimeocdn.com",
      },
      // Additional trusted CDNs
      {
        protocol: "https",
        hostname: "*.akamaized.net",
      },
      {
        protocol: "https",
        hostname: "*.fastly.net",
      },
      {
        protocol: "https",
        hostname: "*.imgix.net",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
