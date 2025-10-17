/**
 * @type {import('next').NextConfig}
 **/

const fs = require('fs');
const nextTranslate = require('next-translate-plugin')
const staNotations = JSON.parse(
  fs.readFileSync('./data/parsed/sta-notations.json')
);

module.exports = async () => {
  const nextConfig = {
    basePath: '/doc',
    env: {
      basePath: '/doc',
      solrHost: 'solr',
      NEXT_PUBLIC_VERSION: await getVersion(),
      NEXT_PUBLIC_EDITOR_ENABLED: process.env.EDITOR_ENABLED || 'false',
      NEXT_PUBLIC_API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8080',
    },
    images: {
      domains: ['www.cilip.org.uk'],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    reactStrictMode: true,
    async redirects() {
      return [
        ...Object.keys(staNotations).map((entityId) => ({
          source: `/${entityId}`,
          destination: `/${staNotations[entityId].label}`,
          permanent: true, // temp, until data is fixed
        })),
      ];
    },
  };
  // return withLess(nextConfig);
  return nextTranslate(nextConfig);
};

/**
 * @returns {string} latest git tag
 */
const getVersion = () => {
  const { trim } = require('lodash');
  const { exec } = require('child_process');
  return new Promise(function (resolve, reject) {
    exec(
      'git describe --tags --abbrev=0',
      function (error, standardOutput, standardError) {
        if (error) {
          reject("Problem in getVersion: " + error);

          return;
        }

        if (standardError) {
          reject("Problem in getVersion: " + standardError);

          return;
        }
        resolve(trim(standardOutput));
      }
    );
  });
};
