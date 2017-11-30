var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 自动生成index.html
var CleanWebpackPlugin = require('clean-webpack-plugin'); // 清除指定目录文件
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');   // 从chunk中提取出*.css，移动到独立的css文件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log(path.resolve(__dirname, 'app'));

module.exports = {
  entry: {
    app: './app/index.js',
    vendor: ['lodash']
  },
  output: {
    filename: '[name].[hash].js',          // 输出文件名称
    chunkFilename: '[name].[hash].js',
    path: path.resolve(__dirname, 'dist'), // 输出文件存放位置
    publicPath: './'                       // 输出文件在index.html中的引入路径
  },
  devtool: 'inline-source-map',
  devServer: {
    hot: true, // 告诉 dev-server using HMR
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/' // webpack-dev-server 访问的路径
  },
  resolve: {
    // extensions: ['.js', '.json', '.css', '.vue'], // 使用的扩展名
    alias: {  // 模块别名列表
      lib: 'app/lib' // just test
    },
    modules: ['node_modules', path.resolve(__dirname, 'app')] // 模块寻找路径
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({ // 提取入口chunk的css
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              importLoaders: 1  //这里可以简单理解为，如果css文件中有import 进来的文件也进行处理
            }
          }, {
            loader: 'postcss-loader',
            options: {  // 如果没有options这个选项将会报错 No PostCSS Config found
              plugins: (loader) => [
                require('postcss-import')({root: loader.resourcePath}),
                // require('autoprefixer')(), //CSS浏览器兼容
                require('postcss-cssnext')(),
                require('cssnano')()  //压缩css
              ]
            }
          }]
        })
      },
      {
        test: /\.(png|svg|gif|jpe?g|wav)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: '[name].[hash:7].[ext]'
          }
        }]
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      template: 'app/index.html',   // 模板路径
      title: 'Output Management'    // index.html 标题选项 自定义
    }),
    new webpack.optimize.CommonsChunkPlugin({ // 提取公共脚本
      names: ['vendor', 'manifest'],
      minChunks: function (module, count) {
        console.log(module.resource, count);
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    new ExtractTextPlugin({
      filename: (getPath) => {
        console.log('path: ', getPath('css/[name].[contenthash].css'));
        return getPath('css/[name].[contenthash].css');
      }
    }),
    // new ChunkManifestPlugin({
    //   filename: "chunk-manifest.json",
    //   manifestVariable: "webpackManifest"
    // }),
    new webpack.HotModuleReplacementPlugin() // 启用 HMR
  ]
}
