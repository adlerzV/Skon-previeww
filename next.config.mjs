import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  poweredByHeader: false,

  images: {
    formats: ['image/webp'],

    deviceSizes: [
      360,
      414,
      640,
      750,
      828,
      1080,
      1200,
      1600,
      1920,
    ],

    imageSizes: [
      16,
      24,
      32,
      48,
      64,
      86,
      96,
      108,
      128,
      256,
      384,
    ],

    qualities: [60, 70, 75, 80, 85, 90],

    minimumCacheTTL: 60 * 60 * 24 * 30,

    dangerouslyAllowLocalIP: true,

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.arena2battle.com',
      },
      {
        protocol: 'https',
        hostname: 'arena2battle.com',
      },
    ],
  },

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withBundleAnalyzer(nextConfig);