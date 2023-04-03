/**
 * @type {import('next').NextConfig}
 **/
const withLess = require('next-with-less');

module.exports = () => {
  const nextConfig = {
    basePath: '/doc',
    env: {
      basePath: '/doc',
      solrHost: 'solr',
    },
    images: {
      domains: ['www.cilip.org.uk'],
    },
    reactStrictMode: true,
    async redirects() {
      // return redirectArr
      return [
        {
          source: '/entries/:entityId',
          destination: '/entities/:entityId',
          permanent: true,
        },
      ];
    },
  };
  return withLess(nextConfig);
};
