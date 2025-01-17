const path = require('path');

module.exports = {
  stories: ['../stories/**/*.stories.js'],
  logLevel: 'debug',
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-storysource',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds',
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
      test: [/\.stories\.js$/, /index\.js$/],
      loaders: [require.resolve('@storybook/source-loader')],
      include: [path.resolve(__dirname, '../')],
      enforce: 'pre',
    });
    return config;
  },
};
