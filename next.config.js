/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"],
    // Enable Turbopack for ultra-fast compilation
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Optimize bundling for faster compilation
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot', 'framer-motion', '@humeai/voice-react'],
    // Fast compilation optimizations
    typedRoutes: false,
    esmExternals: true,
    // Faster builds
    webVitalsAttribution: ['CLS', 'LCP'],
    // Speed up bundling
    serverMinification: false,
  },
  // Optimize for faster builds
  swcMinify: true,
  // Remove unsupported Turbopack options
  // Note: compiler.removeConsole not supported in Turbopack yet
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