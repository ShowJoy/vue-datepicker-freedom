// 检查Node和 npm 版本
require('./check-versions')();

// 获取 config/index.js的默认配置
var config = require('../config');

if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var opn = require('opn');
// 使用 proxyTable
var proxyMiddleware = require('http-proxy-middleware');
var webpackConfig = require('./webpack.dev.conf');

var port = process.env.PORT || config.dev.port;
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowse
// 使用config.dev.proxyTable 的配置作为 proxyTable 的代理配置
var proxyTable = config.dev.proxyTable;

// 使用 express 启动一个服务
var app = express();

// 启动 webpack 进行编译
var compiler = webpack(webpackConfig);

// 启动 webpack-dev-middleware 将编译文件暂存到内存中 自动编译文件
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
});

// 启动 webpack-hot-middleware, 也就是我们常说的 热重载
var hotMiddleware = require('webpack-hot-middleware')(compiler);

// 当html-webpack-plugin模板改变时，强制重载页面
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({action: 'reload'});
    cb();
  });
});

// 代理api请求
// 将proxyTable 中的请求配置挂载到启动的express服务上
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
});

// 使用 connect-history-api-fallback 匹配资源，如果不匹配就可以重定向至指定地址
app.use(require('connect-history-api-fallback')())

// 将暂存到内存中的 webpack 编译后的文件挂载到 express 服务上
app.use(devMiddleware);

// 将 hot-reload挂载到express服务上
app.use(hotMiddleware);

// 拼接static文件夹的静态资源路径
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory);
// 为静态资源目录指定一个挂载路径
app.use(staticPath, express.static('./static'));

var uri = 'http://localhost:' + port;

var _resolve;
var readyPromise = new Promise(resolve => {
  _resolve = resolve;
});

console.log('> starting dev server...');

devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n');
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    open(uri);
  }
  _resolve();
});

var server = app.listen(port);

module.exports = {
  ready: readyPromise,
  close: ()=> {
    server.close()
  }
};
