// Here we use the @cloudflare/next-on-pages next-dev module to allow us to
// use bindings during local development (when running the application with
// `next dev`). This function is only necessary during development and
// has no impact outside of that. For more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
// DISABLED FOR NORMAL POSTGRES USAGE:
// setupDevPlatform().catch(console.error);

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@lexkit/editor"],

  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'image.tmdb.org',
      //   pathname: '/t/p/**',
      // },
    ],
  },
};

export default nextConfig;
