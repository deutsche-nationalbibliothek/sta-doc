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
const pica3ToStaNotation = Object.entries(fields).map(([key,field]) => {
  if (field.codings.PICA3.length > 0) {
    return {
      PICA3: field.codings.PICA3[0],
      staNotationLabel: field.staNotationLabel
    }
  }
}).filter(Boolean);

const almaToStaNotation = Object.entries(fields).map(([key,field]) => {
  if (field.codings.Alma.length > 0) {
    return {
      Alma: field.codings.Alma[0],
      staNotationLabel: field.staNotationLabel
    }
  }
}).filter(Boolean);

const alephToStaNotation = Object.entries(fields).map(([key,field]) => {
  if (field.codings.Aleph.length > 0) {
    return {
      Aleph: field.codings.Aleph[0],
      staNotationLabel: field.staNotationLabel
    }
  }
}).filter(Boolean);

module.exports = async () => {
  const nextConfig = {
    basePath: '/doc',
    env: {
      basePath: '/doc',
      solrHost: process.env.SOLR_HOST || 'localhost',
      solrPort: process.env.SOLR_PORT || '8983',
      NEXT_PUBLIC_VERSION: await getVersion(),
    },
    i18n: {
      locales: ['de', 'fr'], // Both locales must be listed
      defaultLocale: 'de',
    },
    images: {
      domains: ['www.cilip.org.uk'],
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    // Cap SSG fan-out so peak RAM stays proportional to a few workers, not all CPUs.
    experimental: {
      cpus: 2,
      staticGenerationMaxConcurrency: 4,
    },
    compiler: {
      emotion: true,
    },
    reactStrictMode: true,
    async redirects() {
      return [
        ...Object.keys(staNotations).map((entityId) => ({
          source: `/${entityId}`,
          destination: `/${staNotations[entityId].label}`,
          permanent: true
        })),
        ...pica3ToStaNotation
          .filter(entry => !['130', '430', '530', '730'].includes(entry.PICA3))
          .map((entry) => ({
            source: `/GND-PICA3-${entry.PICA3}`,
            destination: `/${entry.staNotationLabel}`,
            permanent: true
          })),
        ...almaToStaNotation
          .filter(entry => !['035', '100', '110', '111',
            '410','411','500','510','511',
            '700','710','711'
          ].includes(entry.Alma))
          .map((entry) => ({
            source: `/GND-ALMA-${entry.Alma}`,
            destination: `/${entry.staNotationLabel}`,
            permanent: true
          })),
        ...alephToStaNotation.map((entry) => ({
          source: `/GND-ALEPH-${entry.Aleph}`,
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
