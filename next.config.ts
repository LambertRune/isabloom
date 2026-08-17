import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  agentRules: false,
  images: {
    localPatterns: [{ pathname: "/media/**" }],
  },
};

export default nextConfig;
