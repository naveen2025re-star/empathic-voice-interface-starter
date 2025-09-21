/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"]
  },
  // Optimize for faster builds and navigation
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  async headers() {
    return [
      {
        source: '/performance',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300'
          }
        ]
      },
      {
        source: '/((?!performance).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      }
    ];
  },
  // Allow Replit's proxy/iframe hosting
  async rewrites() {
    return [];
  },
  // Configure for development in Replit environment
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      ...this?.experimental,
      allowedRevalidateHeaderKeys: ['host'],
    }
  })
};

module.exports = nextConfig;