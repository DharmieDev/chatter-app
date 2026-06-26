import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**", // This allows all image paths from this specific Google domain
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: 'https',
        hostname: 'vdrslombxsrsdisposoi.supabase.co', 
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
