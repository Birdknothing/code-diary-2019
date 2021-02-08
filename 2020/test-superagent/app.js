    const sp = require("superagent-charset")(require("superagent"));
    const jszip = require("jszip");
    const path = require("path");
    const fs = require("fs");
    const zip = new jszip();
    const getImg = url =>
        sp
            .get(encodeURI(url))
            // .charset("utf-8")
            .end(async (err, res) => {
                // Object.keys(res).forEach(ele => {
                //   console.log(ele,typeof res[ele]);
                // });
                fs.writeFileSync(path.basename(url), res.body);
                const test = zip.folder("test");
                test.file("test.gif", res.body.toString("base64"), {
                    base64: true
                });
                const buf = await zip.generateAsync({
                    type: "nodebuffer",
                    compression: "DEFLATE",
                    compressionOptions: {
                        level: 9
                    }
                });
                fs.writeFile("./test.zip", buf, () => {});
            });
    const pic = "https://www.fesucai.com/images/defaultpic.gif";
    const txt = "https://www.fesucai.com/i/common.php";
    getImg(txt);
