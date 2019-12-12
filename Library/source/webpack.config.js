"use strict";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BabelMinify = require("babel-minify-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Extract = require("extract-text-webpack-plugin");
module.exports = {
    entry: { main: "./src/pages/app.tsx" },
    output: {
        filename: "[name].js",
        path: __dirname + "/dist"
    },
    mode: process.env.PACK_WEB === "1" ? "production" : "development",
    // devtool: process.env.PACK_WEB === "1" ? false : "cheap-module-eval-source-map",
    devtool: process.env.PACK_WEB === "1" ? false : "source-map",
    // devtool: false,
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
                    { loader: "babel-loader", options: { presets: ["@babel/preset-react"] } },
                    "awesome-typescript-loader"
                ]
            },
            {
                test: /\.jsx?$/,
                use: [{ loader: "babel-loader", options: { presets: ["@babel/preset-react"] } }]
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                use: [
                    {
                        loader: "url-loader",
                        options: {
                            limit: 10240
                        }
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: Extract.extract([
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
                    "sass-loader"
                    // { loader: "sass-loader", options: { outputStyle: "compressed" } }
                ])
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
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
        new HtmlWebpackPlugin({
            title: "test",
            template: "template/index.html"
        }),
        new Extract("./main.css"),
        new CleanWebpackPlugin()
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
