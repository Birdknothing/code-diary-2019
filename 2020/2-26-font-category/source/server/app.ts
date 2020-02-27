const express = require("express");
const app = express();
app.listen(3000);
app.use(express.static("./", { index: "index.html" }));
app.use("/mock", require("./mock.ts"));
// http://localhost:3000
// http://192.168.211.46:3000
export {};
