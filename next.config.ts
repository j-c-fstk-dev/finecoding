/** @type {import('next').NextConfig} */

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const nextConfig = {
  output: 'export',
  basePath: isGithubActions ? '/finecoding' : '',
  assetPrefix: isGithubActions ? '/finecoding/' : '',
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
