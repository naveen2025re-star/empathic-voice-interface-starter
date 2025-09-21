const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compiler optimizations (conditional for Turbopack compatibility)
  ...(process.env.NODE_ENV === 'production' && !process.env.TURBOPACK && {
    compiler: {
      removeConsole: true,
    },
  }),
  // Advanced compression and optimization
  compress: true,
  poweredByHeader: false,
  // Performance optimizations
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
    // Optimize bundling for faster compilation - expanded list
    optimizePackageImports: [
      'lucide-react', 
      '@radix-ui/react-slot', 
      '@radix-ui/react-toggle',
      '@radix-ui/react-label',
      'framer-motion', 
      '@humeai/voice-react',
      'tailwind-merge',
      'class-variance-authority',
      'react-virtualized'
    ],
    // Modern performance features
    typedRoutes: false,
    esmExternals: true,
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'TTFB', 'INP'],
    serverMinification: true, // Enable for production
    // Reduce memory usage and speed up builds
    staleTimes: {
      dynamic: 0,    // Faster dynamic updates
      static: 300,   // 5 minutes for static content
    },
    // Advanced optimizations
    optimizeServerReact: true,
    serverSourceMaps: false, // Disable for faster builds
    // Optimize CSS processing
    optimizeCss: true,
    // Enable parallel processing
    workerThreads: true,
    // Performance optimizations (Turbopack compatible)
  },
  // Production optimizations
  swcMinify: true,
  reactStrictMode: true,
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 86400, // 24 hours
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Essential performance headers (simplified for compatibility)
  async headers() {
    return [
      {
        // Static assets optimization
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        // API routes optimization
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          }
        ]
      },
      {
        // General security headers
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
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
  onDemandEntries: {
    // Optimize memory usage in development
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Generate smaller bundles
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          maxSize: 244000, // 244kb max chunk size
        }
      };
    }
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);