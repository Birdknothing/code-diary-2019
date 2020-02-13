const express = require("express");
const Cors = require("cors");
const app = express();

app.listen(3010);
app.use(Cors());
app.use("/my-min-library", express.static("../my-min-library"));
app.use("/index", express.static("./1.html"));
app.use("/test", express.static("./dist"));
    