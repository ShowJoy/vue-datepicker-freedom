var path = require('path');
var config = require('../config');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 从chunk中提取出*.css，移动到独立的css文件

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = function (options) {
  options = options || {};

  var cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  };

  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader];
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      });
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      });
    } else {
      return ['vue-style-loader'].concat(loaders);
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    scss: generateLoaders('sass'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus'),
  }
};

exports.styleLoaders = function (options) {
  var output = [];
  var loaders = exports.cssLoaders(options);

  for (var extension in loaders) {
    var loader = loaders[extension];
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    });
  }
  return output;
};
