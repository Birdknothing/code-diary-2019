const express = require("express");
const app = express();
app.listen(3010);
app.use(express.static("./", { index: "1-tmp.html" }));
const path = require("path");
const cd = (...args) => path.resolve(...args);
app.use("/lib", express.static(cd("../my-min-library")));
// http://192.168.211.46:3010
