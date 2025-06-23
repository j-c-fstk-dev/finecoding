/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/finecoding',
  assetPrefix: '/finecoding/',
  images: {
    unoptimized: true,
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
