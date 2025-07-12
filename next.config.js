/** @type {import('next').NextConfig} */

// Check for Firebase environment variables
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not set. Please check your .env.local file.");
}

const nextConfig = {
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
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
