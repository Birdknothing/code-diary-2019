const express = require("express");
const app = express();
app.listen(3006);
app.use(express.static("./", { index: "1.html" }));
