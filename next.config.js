/**
 * @type {import('next').NextConfig}
 **/
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants')
// const fs = require('fs');
// const staNotations = JSON.parse(fs.readFileSync('./data/parsed/sta-notations.json'));
const withLess = require('next-with-less');

// const createRedirectArray = () => {
//   const redirectObjects = []
//   redirectObjects.push(
//     {
//       source: '/entries/:entityId',
//       destination: '/entities/:entityId',
//       permanent: true
//     }
//   )
//   Object.keys(staNotations)
//     // .filter((obj, i) => i < 3)
//     .forEach((obj) => {
//       redirectObjects.push(
//         {
//           source: `/entities/${obj}`,
//           destination: `/entities/${staNotations[obj].label}`,
//           permanent: true
//         }
//       )
//     })
//   console.log(redirectObjects[1])
//   return redirectObjects
// }
// const redirectArr = createRedirectArray()

module.exports = (phase) => {
  // console.log(phase)
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    const nextConfig = {
      basePath: '',
      env: {
        basePath: '',
        solrHost: 'localhost'
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
    }
    return withLess(nextConfig)
  }
  if (phase === PHASE_PRODUCTION_SERVER || PHASE_PRODUCTION_BUILD) {
    const nextConfig = {
      basePath: '/doc',
      env: {
        basePath: '/doc',
        solrHost: 'solr'
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
    }
    return withLess(nextConfig)
  }
}
