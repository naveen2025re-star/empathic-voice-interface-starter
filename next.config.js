/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["hume"],
    optimizeCss: true,
    // Faster builds with modern features
    optimizePackageImports: ['lucide-react', 'framer-motion', '@radix-ui/react-slot'],
    webVitalsAttribution: ['CLS', 'LCP'],
    // Only include non-Turbopack options when not using Turbo
    ...(isDev && !process.env.TURBOPACK && {
      allowedRevalidateHeaderKeys: ['host'],
    })
  },
  // Compiler optimizations - only for non-Turbopack builds
  ...(process.env.TURBOPACK ? {} : {
    compiler: {
      // Remove console logs in production for better performance
      removeConsole: process.env.NODE_ENV === 'production',
      // Enable SWC emotion plugin for better styled-components performance
      styledComponents: true,
    },
  }),
  // Performance optimizations
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Optimize images and fonts
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/webp', 'image/avif'],
  },
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