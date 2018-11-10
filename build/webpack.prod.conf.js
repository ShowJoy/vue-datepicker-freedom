var path = require('path');
var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');

var env = config.build.env;

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  entry: './src/component/date-picker.vue',
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('[name].js'),
    libraryTarget: 'commonjs2'
  },
  externals: { vue: 'vue' },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
});

module.exports = webpackConfig;
