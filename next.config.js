/**
 * @type {import('next').NextConfig}
 **/

module.exports = async () => {
  const nextConfig = {
    basePath: '/doc',
    env: {
      basePath: '/doc',
      solrHost: 'solr',
      NEXT_PUBLIC_VERSION: await getVersion(),
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
  // return withLess(nextConfig);
  return nextConfig;
};

/**
 * @returns {string} latest git tag
 */
const getVersion = () => {
  const { trim } = require('lodash');
  const { exec } = require('child_process');
  return new Promise(function (resolve, reject) {
    exec(
      'git describe --abbrev=0',
      function (error, standardOutput, standardError) {
        if (error) {
          reject();

          return;
        }

        if (standardError) {
          reject(standardError);

          return;
        }

        resolve(trim(standardOutput));
      }
    );
  });
};
