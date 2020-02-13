"use strict";
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BabelMinify = require("babel-minify-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Extract = require("extract-text-webpack-plugin");
module.exports = {
    entry: { main: "./test/index.tsx" },
    output: {
        filename: "bundle.js",
        path: __dirname + "/dist"
    },
    mode: "production",
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
                test: /\.(jsx|tsx)?$/,
                use: [
                    { loader: "babel-loader", options: { presets: ["@babel/preset-react"] } },
                    "awesome-typescript-loader"
                ]
            },
            { test: /\.png$/, use: ["file-loader"] },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader?modules",
                    "sass-loader"
                    // { loader: "sass-loader", options: { outputStyle: "compressed" } }
                ]
            },
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    // 不打包，引入
    externals: {
        react: "React"
        //   'react-dom': 'ReactDOM'
    },
    optimization: {
        minimizer: [new BabelMinify()]
    },
    plugins: [
        // new HtmlWebpackPlugin({
        //     title: "test",
        //     css: ["bundle.css"],
        //     template: "template/index.html"
        // }),
        // new Extract("./bundle.css"),
        new CleanWebpackPlugin()
    ]
    // devServer: {
    //     // 默认localhost
    //     // host: "http://192.168.211.46",
    //     // link http://localhost:8686
    //     // 也可以是数组，放入多个目录
    //     contentBase: "./dist",
    //     compress: true,
    //     proxy: {
    //         "/getList": {
    //             target: "http://192.168.211.46:3020/getList"
    //         }
    //     },
    //     port: 8686
    // }
};
