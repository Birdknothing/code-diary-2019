const path = require("path");
const { ProvidePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const WorkboxPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.mode === 'production';

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: "./src/index.js"
  },
  devServer: {
    host: "127.0.0.1",
    contentBase: "./dist",
    historyApiFallback: true,
    port: 8686,
  },
  module: {
    rules: [
      {
        test: /\.(jpeg|png|jpg)$/,
        use: [
          {
            loader: "url-loader",
            options: { name: "[name].[ext]", outputPath: "src", limit: 20480 }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")()]
            }
          }
        ]
      },
      // @babel/preset-env用来翻译es6到es5，useBuiltIns用来只打包需要用到的polyfill，比如promise等
      {
        test: /\.js$/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    usedExports: true,
    splitChunks: {
      chunks: "all",
      //   minSize: 1,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: "vendor"
        },
        default: {
          priority: -20,
          name: "tt"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "test",
      template: "template/index.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css"
    }),
    new BundleAnalyzerPlugin(),
    new ProvidePlugin({
      $: path.resolve(path.join(__dirname, "src/jq.js"))
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: isProduction ? "[name]pro.[contenthash].js" : "[name]dev.[hash].js",
    path: path.resolve(__dirname, "dist")
  }
};
