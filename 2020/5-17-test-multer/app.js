const express = require("express");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // 第二个参数为false，拒绝此文件
        cb(null, "tmp");
    },
    filename: function(req, file, cb) {
        // cb(null, file.fieldname + "-" + Date.now());
        cb(null, file.originalname);
    },
});

const app = express();
app.listen(3000);
app.use("/test", require("./tmp/route"));
app.use(
    "/my-min-library",
    express.static("/Users/shaofeibo/Desktop/code-diary/my-min-library")
);

app.use(express.static("./", { index: "index.html" }));
// http://localhost:3000
