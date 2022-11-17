/**
 * @type {import('next').NextConfig}
 **/
const withLess = require('next-with-less');

const nextConfig = {
  images: {
    domains: ['www.cilip.org.uk'],
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/entries/:entityId',
        destination: '/entities/:entityId',
        permanent: true,
      },
    ];
  },
};

module.exports = withLess(nextConfig);
