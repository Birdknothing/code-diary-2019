const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        // 第二个参数为false，拒绝此文件
        cb(null, path.resolve("static/abc"));
    },
    filename: function(req, file, cb) {
        // cb(null, file.fieldname + "-" + Date.now());
        cb(null, file.originalname);
    },
});
const upload = multer({
    storage: storage,
});
router.use(
    "/test",
    upload.any([
        { name: "test", maxCount: 1 },
        { name: "somefile", maxCount: 1 },
    ]),
    (req, res, next) => {
        console.log(req.body);
        console.log(req.files);
    }
);

module.exports = router;
