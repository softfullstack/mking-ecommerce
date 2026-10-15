import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // eslint.config.js es flat config; se corre aparte con `npm run lint`
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

initOpenNextCloudflareForDev();
