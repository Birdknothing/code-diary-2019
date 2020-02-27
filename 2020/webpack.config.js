const path = require("path");
const { ProvidePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

const WorkboxPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.mode === "production";

module.exports = {
  mode: isProduction ? "production" : "development",
  entry: {
    main: "./src/index.tsx"
  },
  devServer: {
    host: "127.0.0.1",
    contentBase: "./dist",
    historyApiFallback: true,
    port: 8686
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"]
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
          {
            loader: "css-loader"
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")()]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { useBuiltIns: "usage" }]]
            }
          },
          "ts-loader"
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          ouput: {
            comments: false
          }
        }
      })
    ],
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\/]node_modules[\/]/,
          priority: -10,
          name: "vendor"
        },
        default: {
          priority: -20,
          name: "main"
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "h5_dev",
      template: "./template/template.html"
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    // new BundleAnalyzerPlugin(),
    new ProvidePlugin({
      $: path.resolve(path.join(__dirname, "src/jq.js"))
    })
  ],
  output: {
    filename: isProduction ? "[name].[contenthash].js" : "[name].dev.js",
    path: path.resolve(__dirname, "dist")
  }
};
