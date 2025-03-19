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
        ...Object.keys(staNotations).map((entityId) => ({
          source: `/entities/${entityId}`,
          destination: `/${staNotations[entityId].label}`,
          permanent: false, // temp, until data is fixed
        })),
        ...Object.keys(staNotations).map((entityId) => ({
          source: `/${entityId}`,
          destination: `/${staNotations[entityId].label}`,
          permanent: false, // temp, until data is fixed
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
