/** @type {import('next').NextConfig} */
const nextConfig = {
  // NEXT_PUBLIC_* variables are inlined automatically; no `env` block needed.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  // Keep these as regular Node dependencies instead of bundling them.
  serverExternalPackages: ['firebase-admin', 'genkit', '@genkit-ai/google-genai'],
};

module.exports = nextConfig;
