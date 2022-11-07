/**
 * @type {import('next').NextConfig}
 **/
const withLess = require("next-with-less");

const nextConfig = {
  images: {
    domains: ['www.cilip.org.uk'],
  },
  reactStrictMode: true,
};

module.exports = withLess(nextConfig);
