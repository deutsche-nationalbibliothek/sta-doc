/**
 * @type {import('next').NextConfig}
 **/

const fs = require('fs');
const nextTranslate = require('next-translate-plugin')
const staNotations = JSON.parse(
  fs.readFileSync('./data/parsed/sta-notations.json')
);
const fields = JSON.parse(
  fs.readFileSync('./data/parsed/fields.json')
);
const pica3ToStaNotation = fields.map((field) => {
  if (field.codings.PICA3) {
    return {
      PICA3: field.codings.PICA3,
      staNotationLabel: staNotations[field.id].label
    }
  }
}).filter(Boolean);

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
        ...pica3ToStaNotation.map((entry) => ({
          source: `/PICA3/${entry.PICA3}`,
          destination: `/${entry.staNotationLabel}`,
          permanent: true
        }))
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
