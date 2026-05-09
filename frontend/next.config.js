/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.wp.build',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'le-cdn.hibuwebsites.com',
      },
      {
        protocol: 'https',
        hostname: '**.hibuwebsites.com',
      },
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
    ],
  },
  async rewrites() {
    const wpUrl = (process.env.NEXT_PUBLIC_WORDPRESS_URL || 'http://localhost:8882').replace(/\/$/, '');
    return [
      {
        source: '/wp-proxy/:path*',
        destination: `${wpUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
