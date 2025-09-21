/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
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