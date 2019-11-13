const express = require("express");
const app = express();
const fs = require("fs");
console.log("p1 connected");
fs.writeSync("p1 connected");

app.listen(3010);
app.use(express.static("./"));
