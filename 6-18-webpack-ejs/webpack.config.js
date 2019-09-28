const path = require('path');
// const myLoader = require('./myloader');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BabelMinify = require('babel-minify-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const workbox = require('workbox-webpack-plugin');
const test = 1;
const defaultChain = ['./myloader2.js', 'babel-loader'];
test && defaultChain.splice(1, 0, './myloader.js');
module.exports = {
  entry: './testindex.js',
  mode: 'development',
  output: {
    path: path.resolve('./dist'),
    filename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'hello word'
    })
  ],
  optimization: {
    minimizer: [new BabelMinify()]
  },
  module: {
    rules: [{ test: /\.js$/, sideEffects: true, use: defaultChain }, { test: /data\.xml$/, use: 'xml-loader' }]
  }
};
