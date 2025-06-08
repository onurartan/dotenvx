import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // reactStrictMode: false,
  // productionBrowserSourceMaps: true 

   eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
