const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.js$/,
      resolve: { fullySpecified: false }, // This may prevent source map errors for certain libraries.
    });
    return config;
  },
};

module.exports = nextConfig;
