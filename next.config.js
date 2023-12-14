/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals')
const nextConfig = {
    webpack: (config, { isServer }) => {
        if (isServer) {
          config.externals = nodeExternals();
        }
        return config;
      },
};

module.exports = nextConfig;
