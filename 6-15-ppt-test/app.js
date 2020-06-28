const express = require("express");
const app = express();
app.listen(3016);
app.use(express.static("./"));
app.use("/library", express.static("E:\\code-diary-2019\\my-min-library"));
// http://localhost:3016
