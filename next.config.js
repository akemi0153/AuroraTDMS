const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.mjs$/,
      resolve: { fullySpecified: false }, // This may prevent source map errors for certain libraries.
    });
    return config;
  },
};
module.exports = nextConfig;
