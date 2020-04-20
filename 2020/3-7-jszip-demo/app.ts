const fs = require("fs");
const jszip = require("jszip");
const zip = new jszip();
zip.file("hello.txt", "test");
zip
  .generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  })
  .then(bin => {
    console.log(typeof bin);
    console.log(bin);
    fs.writeFileSync("./test1.zip", bin);
  });
