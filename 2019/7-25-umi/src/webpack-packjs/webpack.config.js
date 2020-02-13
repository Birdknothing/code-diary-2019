'use strict';
const path = require('path');
const BabelMinify = require('babel-minify-webpack-plugin');

module.exports = {
  entry:'index.js',
  mode: 'production',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [{ test: /\.ts?$/, loader: 'awesome-typescript-loader' }]
  },
  // 不打包，引入
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM'
  // },
  // optimization: {
  //   minimizer: [new BabelMinify()]
  // },
  plugins: [
    // new HtmlWebpackPlugin({
    //   title: '[name]',
    //   css: ['[name].css'],
    //   template: 'src/assets/html/index.html'
    // }),
    new BabelMinify()
  ]
};
