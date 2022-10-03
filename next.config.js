module.exports = {
  images: {
    domains: ['www.cilip.org.uk'],
  },
  experimental: {
    largePageDataBytes: 269 * 1000,
  },
  reactStrictMode: true,
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
};
