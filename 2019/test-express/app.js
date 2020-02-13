const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(3012);
// app.all("/*", (req, res, next) => {
//     console.log(Reflect.ownKeys(req));
//     console.log(req.method);
//     console.log(req.baseUrl);
//     console.log(req.query);
//     console.log(req.body);
//     next();
// });
app.use("/abc", require("./router.js"));
app.use("/my-min-library", express.static("../my-min-library"));
app.use(express.static("./"));
// http://192.168.211.46:3012
