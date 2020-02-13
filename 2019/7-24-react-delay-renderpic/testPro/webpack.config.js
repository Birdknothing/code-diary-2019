'use strict';
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BabelMinify = require('babel-minify-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Extract = require('extract-text-webpack-plugin');
module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist'
  },
  mode: process.env.PACK_WEB === '1' ? 'production' : 'development',
  devtool: process.env.PACK_WEB === '1' ? false : 'source-map',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: 'awesome-typescript-loader' }, { test: /\.png$/, use: ['file-loader'] }, { test: /\.scss$/, use: Extract.extract(['css-loader', { loader: 'sass-loader', options: { outputStyle: 'compressed' } }]) }, { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }]
  },
  // 不打包，引入
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },
  optimization: {
    minimizer: [new BabelMinify()]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'test',
      css: ['bundle.css'],
      template: 'src/assets/html/index.html'
    }),
    new Extract('./bundle.css')
  ],
  devServer: {
    // 默认localhost
    host: '192.168.64.136',
    // 也可以是数组，放入多个目录
    contentBase: './dist',
    compress: true,
    port: 8686
  }
};
