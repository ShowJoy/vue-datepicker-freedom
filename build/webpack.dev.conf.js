var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
// 使用 webpack 配置合并插件
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var htmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 将 Hol-reload 相对路径添加到 webpack.base.conf 的 对应 entry 前
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

// 将我们 webpack.dev.conf.js 的配置和 webpack.base.conf.js 的配置合并
module.exports = merge(baseWebpackConfig, {
  module: {
    // 使用 styleLoaders
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })
  },
  devtool: '#source-map',
  plugins: [
    // new BundleAnalyzerPlugin(),
    // definePlugin 接受字符串插入到代码当中，所以你需要的话可以写上 js 的字符串
    // DefinePlugin 允许创建一个在编译时可以配置的全局常量
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // HotModule 插件在页面进行变更的时只会重绘对应的页面模块，不会重绘整个HTML文件
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new htmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
});
