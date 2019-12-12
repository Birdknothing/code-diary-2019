"use strict";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BabelMinify = require("babel-minify-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const isProduction = process.env.PACK_WEB === "1";
module.exports = {
    entry: {
        mobile: "./coms/mobile/index.tsx",
        web: "./coms/web/index.tsx"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "..", "dist")
    },
    mode: isProduction ? "production" : "development",
    devtool: isProduction ? false : "source-map",
    resolve: {
        extensions: [".tsx", ".ts", ".jsx", ".js"],
        alias: {
            "@": path.resolve(__dirname)
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx|tsx|ts)?$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [["@babel/preset-env", { useBuiltIns: "usage" }], ["@babel/preset-react"]]
                        }
                    },
                    "awesome-typescript-loader"
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            //   limit: 8192
                            limit: 20480
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?modules",
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [require("autoprefixer")]
                        }
                    },
                    "sass-loader"
                ]
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // externals: {
    //     react: "React"
    // },
    optimization: {
        minimizer: [new BabelMinify()]
    },
    plugins: [new CleanWebpackPlugin()]
};
