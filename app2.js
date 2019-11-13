const express = require("express");
const app = express();
console.log("p2 connected");

app.listen(3011);
app.use(express.static("./"));
