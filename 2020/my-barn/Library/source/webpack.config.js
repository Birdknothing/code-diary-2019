"use strict";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BabelMinify = require("babel-minify-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Extract = require("extract-text-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const mode = process.env.PACK_WEB === "1" ? "production" : "development";
const isProduction = process.env.PACK_WEB === "1";
module.exports = {
    entry: { main: "./src/pages/app.tsx" },
    output: {
        filename: "./js/[name].js",
        path: path.resolve(__dirname, mode === "production" ? ".." : "./", "dist")
    },
    mode,
    devtool: process.env.PACK_WEB === "1" ? false : "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        alias: {
            "@": require("path").resolve(__dirname, "src")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    { loader: "babel-loader", options: { presets: [["@babel/preset-env", { useBuiltIns: "usage" }], ["@babel/preset-react"]] } },
                    "awesome-typescript-loader"
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "url-loader?limit=10240&name=./img/_[hash:5]_.[ext]"
                    }
                ]
            },
            {
                test: /\.scss$/,
                // use:
                // ExtractMain.extract({
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "css-loader",
                        options: {
                            modules: { localIdentName: "[name]_[local]-[hash:base64:5]" }
                            // localIdentName: "[path][name]__[local]--[hash:base64:5]"
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            importLoaders: 1,
                            plugins: [require("autoprefixer")]
                        }
                    },
                    { loader: "sass-loader", options: { outputStyle: "compressed" } }
                ]
                // fallback: "style-loader"
                // })
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // 不打包，引入
    // externals: {
    //   react: 'React',
    //   'react-dom': 'ReactDOM'
    // },
    optimization: isProduction
        ? {
              // minimizer: [new BabelMinify()],
              minimize: true,
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
        new CopyPlugin([{ from: "template/index.js", to: "index.js", toType: "file" }]),
        new HtmlWebpackPlugin({
            title: "test",
            template: "template/index.html"
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: "./css/main.css"
        })
        // new Extract("main.css"),
    ],
    devServer: {
        // 默认localhost
        host: "192.168.211.46",
        overlay: true,
        // link http://localhost:8686
        // 也可以是数组，放入多个目录
        contentBase: "./dist",
        compress: true,
        proxy: {
            // "/libs": {
            //     target: "http://192.168.211.46:3008/libs"
            // },
            "/": {
                target: "http://192.168.211.46:3008"
            }
        },
        port: 8686
    }
};
