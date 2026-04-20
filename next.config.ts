import type { NextConfig } from 'next';

const assetBaseUrl =
  process.env.TUTURUUU_API_BASE_URL ??
  process.env.NEXT_PUBLIC_TUTURUUU_API_BASE_URL ??
  'https://tuturuuu.com/api/v1';

const parsedAssetBaseUrl = new URL(assetBaseUrl);
const assetPathPrefix = parsedAssetBaseUrl.pathname.replace(/\/$/, '');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['motion'],
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: parsedAssetBaseUrl.protocol.replace(':', '') as 'http' | 'https',
        hostname: parsedAssetBaseUrl.hostname,
        port: parsedAssetBaseUrl.port || undefined,
        pathname: `${assetPathPrefix}/workspaces/**/external-projects/assets/**`,
      },
      ...(process.env.NODE_ENV === 'development'
        ? [
            {
              protocol: 'http' as const,
              hostname: 'localhost',
              port: '7803',
              pathname: '/api/v1/workspaces/**/external-projects/assets/**',
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
