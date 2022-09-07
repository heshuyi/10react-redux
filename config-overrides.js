// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { addLessLoader, override, fixBabelImports } = require('customize-cra');
// const { addWebpackPlugin } = require('customize-cra');

module.exports = override(
  fixBabelImports('wind-ui', {
    libraryName: '@wind/wind-ui', style: true,
  }),
  fixBabelImports('windjs', {
    libraryName: '@wind/windjs', libraryDirectory: 'es'/* lib 报错 */, style: false,
  }),
  fixBabelImports('@wind/icons', {
    libraryName: '@wind/icons', libraryDirectory: 'lib/icons', style: false, camel2DashComponentName: false,
  }),
  addLessLoader({
    // modifyVars: {
    // },
  }),
  // process.env.NODE_ENV === 'production' && addWebpackPlugin(new BundleAnalyzerPlugin()),
);
