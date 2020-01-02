const express = require("express");
const app = express();
app.listen(3030);
app.use("/index", express.static("./1-tmp.html"));
app.use("/jq", express.static("./my-min-library/jquery.dev.js"));
// http://192.168.211.46:3030/index
