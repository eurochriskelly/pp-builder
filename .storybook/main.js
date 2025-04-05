module.exports = {
  stories: [
    '../src/ui/public/scripts/webcomponents/**/*.stories.js',
    '../src/ui/templates/**/*.stories.js'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  framework: {
    name: '@storybook/web-components-webpack5',
    options: {},
  },
  core: {
    builder: '@storybook/builder-webpack5',
  },
  staticDirs: ['../src/ui/public'], // Serve public/ folder (scripts/, styles/)
};
