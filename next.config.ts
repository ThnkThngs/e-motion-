import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  reactStrictMode: true,
  experimental: {
    // Enable Node.js runtime for middleware so the admin auth code
    // (which uses node:crypto for HMAC) can run there.
    // Flag is accepted by Next 15.5 at runtime but missing from its types yet.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...({ nodeMiddleware: true } as Record<string, any>),
  },
  webpack: (config) => {
    // Force a single instance of `remotion` so the Player's React context
    // is the one InvitationCore's useCurrentFrame consumes. The `$` makes
    // it an exact match — subpath imports of other @remotion/* packages
    // resolve normally.
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      remotion$: path.resolve(__dirname, "node_modules/remotion"),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
