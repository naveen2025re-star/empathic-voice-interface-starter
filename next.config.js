/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"],
    // Optimize bundling for faster compilation
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot', 'framer-motion'],
    // Fast compilation
    typedRoutes: false,
    // Faster builds
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  // Optimize for faster builds
  swcMinify: true,
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
};

module.exports = nextConfig;