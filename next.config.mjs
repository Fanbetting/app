import { webpackFallback } from "@txnlab/use-wallet-react";

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        ...webpackFallback,
      };
    }
    return config;
  },
};

export default nextConfig;
