const express = require("express");
const fs = require("fs");
const rdFile = (url) => fs.readFileSync(url).toString();
const app = express();

const router = express.Router();
router.use("/a", (req, res, next) => {
    console.log("fukk");
    next();
});

app.listen(3003);
app.use(
    "/test",
    (req, res, next) => {
        req.abcd = "abc";
        next();
    },
    (req, res, next) => {
        console.log(req.abcd);
        next();
        // res.send("hello");
    },
    router
);
app.use("/test", (req, res, next) => {
    console.log("hhh");

    res.send("world");
});
// app.use("/test",(req,res)=>{

// });
//   const zipo = new jszip()
//   const zip = zipo.folder('test');
//   zip.file('1.txt','123')
//   zip.file('2.txt','456')
//   const target =await zipo.generateAsync({
//             type: "nodebuffer",
//             compression: "DEFLATE",
//             compressionOptions: {
//                 level: 9
//             }
//         });
//         fs.writeFileSync('./abc.zip',target)
//   res.send(target)
// })
// app.use("/any", (req, res) => {
//     console.log(req.query);
//     console.log(req.body);
//     console.log(req.param);
//     res.send("");
// });
// app.use("/config", (req, res) => {
//     res.send(`'//' + (Class === "Login" ? "172.18.145.175:3000/login" : windowHost + iframeUrl[Class]),`)
//     res.send(rdFile("/Users/shaofeibo/Desktop/code-diary/2020/test-login/EditorTest/Configs/SimplifiedChinese.json"))
// });
app.use(
    "/static",
    express.static("/Users/shaofeibo/Desktop/code-diary/my-min-library")
);
app.use(express.static("./"));
// http://172.18.145.175:3003
// http://localhost:3003
