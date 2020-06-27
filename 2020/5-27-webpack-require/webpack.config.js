const path = require("path");
module.exports = {
    mode: "development",
    entry: "./2.js",
    target: "node",
    context: __dirname,
    node: {
        __dirname: true,
    },
    output: {
        path: path.resolve(__dirname),
    },
};
