const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: true ? "production" : "development",
  entry: {
    main: './src/index.js'
  },
  devServer: {
    contentBase: './dist',
    port: 8686,
    hot: true,
    hotOnly: true
  },

  module: {
    rules: [
      {
        test: /\.(jpeg|png|jpg)$/, use: [{ loader: 'url-loader', options: { name: '[name].[ext]', outputPath: 'src', limit: 20480 } }]
      },
      {
        test: /\.scss$/, use: [MiniCssExtractPlugin.loader,
          "css-loader", "sass-loader", {
          loader: 'postcss-loader', options: {
            plugins: [require('autoprefixer')()]
          }
        }]
      },
      // @babel/preset-env用来翻译es6到es5，useBuiltIns用来只打包需要用到的polyfill，比如promise等
      {
        test: /\.js$/, use: [{
          loader: 'babel-loader',
        }]
      }
    ]
  },
  optimization: {
    usedExports: true,
    splitChunks:
    {
      chunks: "all",
      //   minSize: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendor'
        },
        default: {
          priority: -20,
          name:'tt'
        }
      }
    }
    //     // default:{
    //     //   minChunks:2
    //     // }
    //     // }
    //     // cacheGroups: {
    //     //   commons: {
    //     //     name: "commons",
    //     //     chunks: "initial"
    //     //   }
    //   }
    // }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "test",
      template: "template/index.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./main.css"
    }),
    new BundleAnalyzerPlugin()
  ],
  output: {
    filename: '[name].[contenthash].js',
    chunkFilename:'[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  }
}
