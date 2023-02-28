/**
 * @type {import('next').NextConfig}
 **/
// const fs = require('fs');
// const notations = JSON.parse(fs.readFileSync('./data/parsed/sta-notations.json'));
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
//   Object.keys(notations)
//     // .filter((obj, i) => i < 3)
//     .forEach((obj) => {
//       redirectObjects.push(
//         {
//           source: `/entities/${obj}`,
//           destination: `/entities/${notations[obj].label}`,
//           permanent: true
//         }
//       )
//     })
//   console.log(redirectObjects[1])
//   return redirectObjects
// }
// const redirectArr = createRedirectArray()

const nextConfig = {
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

module.exports = withLess(nextConfig);
