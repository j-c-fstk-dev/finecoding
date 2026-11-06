/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // NEXT_PUBLIC_* variables are inlined automatically; no `env` block needed.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Keep the Admin SDK as a regular Node dependency instead of bundling it.
    serverComponentsExternalPackages: ['firebase-admin'],
  },
  eslint: {
    // No ESLint config is set up in this project yet.
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
