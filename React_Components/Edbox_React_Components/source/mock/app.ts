const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.listen(3011);
app.use(express.static("../../dist"));
export {};
