const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");

const WorkboxPlugin = require("workbox-webpack-plugin");
const isProduction = process.env.mode === "production";
const pages = {
  index: "AiPlayer"
  // test: "test"
};
const entry = {};
const htmlPlugins = [];
Object.entries(pages).forEach(([page, pName]) => {
  entry[page] = "./src/pages/" + page + "/app.tsx";
  htmlPlugins.push(
    new HtmlWebpackPlugin({
      filename: page + ".html",
      title: pName,
      // inject: true,
      // css: ["./" + page + ".css"],
      // // js: [isProduction ? "[name].[contenthash].js" : "[name].dev.js"],
      // js: [page + ".js", "vendor.js"],
      template: "./template/template.html"
    })
  );
});

module.exports = {
  mode: isProduction ? "production" : "development",
  entry,
  devServer: {
    host: "localhost",
    contentBase: "./dist",
    hot: true,
    overlay:true,
    proxy: {
      "/mock/": "http://localhost:3000/mock/"
    },
    port: 8686
  },
  devtool: isProduction ? false : "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src")
    }
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
            loader: "css-loader",
            options: {
              modules: { localIdentName: "[name]_[local]-[hash:base64:5]" }
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("autoprefixer")]
            }
          },
          {
            loader: "sass-loader",
            options: { sassOptions: { outputStyle: "compressed" } }
          }
        ]
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { useBuiltIns: "usage" }],
                ["@babel/preset-react"]
              ]
            }
          },
          "ts-loader"
        ]
      }
    ]
  },
  optimization: isProduction
    ? {
        // minimizer: [new BabelMinify()],
        minimize: true,
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
        },
        minimizer: [
          new TerserPlugin({
            extractComments: "all",
            cache: false,
            parallel: true,
            sourceMap: true,
            minify: (file, sourceMap) => {
              const uglifyJsOptions = {
                compress: {
                  drop_console: true
                }
              };
              if (sourceMap) {
                uglifyJsOptions.sourceMap = {
                  content: sourceMap
                };
              }
              return require("uglify-js").minify(file, uglifyJsOptions);
            }
          })
        ]
      }
    : {},
  plugins: [
    ...htmlPlugins,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "./css/[name].css"
    })
  ],
  output: {
    // filename: isProduction ? "[name].[contenthash].js" : "[name].dev.js",
    filename: "./js/[name].js",
    path: isProduction
      ? path.resolve(__dirname, "..", "dist")
      : path.resolve(__dirname, "dist")
  }
};
