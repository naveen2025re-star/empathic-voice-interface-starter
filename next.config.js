/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"],
    optimizeCss: true,
    ...(isDev && {
      allowedRevalidateHeaderKeys: ['host'],
    })
  },
  // Compiler optimizations
  compiler: {
    // Remove console logs in production for better performance
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: isDev ? 'no-cache, no-store, must-revalidate' : 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  // Allow Replit's proxy/iframe hosting
  async rewrites() {
    return [];
  }
};

module.exports = nextConfig;