const express = require("express");
const app = express();
app.listen(3020);
app.use("/jq", express.static("E:\\code-diary-2019\\my-min-library"));
app.use(express.static("./"));
