const fs = require("fs");
const handleErr = err => err && fs.writeSync(1, err);
const length = require("./length").length;
Array.from({ length: length / 2 }).forEach((ele, i) => {
  // fs.writeFile(`./test1/${i + 1}.js`, "lorem lorem  asodfaosdf", handleErr);
  fs.writeFileSync(`./test1/${i + 1}.js`, "lorem lorem  asodfaosdf");
});
// process.exit();
