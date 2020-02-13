const path = require('path');
// const myLoader = require('./myloader');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const BabelMinify = require('babel-minify-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const test = 1;
const defaultChain = ['./myloader2.js', 'babel-loader'];
test && defaultChain.splice(1, 0, './myloader.js');
module.exports = {
  entry: './index.js',
  mode: 'production',
  output: {
    path: path.resolve('./'),
    filename: '[name].bundle.js'
  },
  optimization: {
    minimizer: [new BabelMinify()]
  },
  module: {
    rules: [
      {
        test: /\.ejs$/,
        sideEffects: true,
        use: [
          './testLoader.js',
          {
            loader: 'ejs-loader',
            options: {
              data: { out: 'hello' },
              htmlmin: true
            }
          }
        ]
      },
      { test: /\.xml$/, use: 'xml-loader' }
    ]
  }
};
