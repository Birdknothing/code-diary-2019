const path = require("path");
const cd = (...args) => path.posix.resolve(...args);
module.exports = {
    configureWebpack: {
        resolve: {
            alias: { "@": cd(__dirname, "src") }
        }
    }
};