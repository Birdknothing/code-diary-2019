const fs = require("fs");
const { spawn, spawnSync } = require("child_process");
let d1 = Date.now();
const length = require("./length").length;
const subp = spawn("node", ["sonWrite.js"]);
const handleErr = err => err && fs.writeSync(1, err);
Array.from({ length: length / 2 }).forEach((ele, i) => {
  // fs.writeFile(
  //   `./test1/${i + length / 2 + 1}.js`,
  //   "lorem lorem  asodfaosdf",
  //   handleErr
  // );
  fs.writeFileSync(
    `./test1/${i + length / 2 + 1}.js`,
    "lorem lorem  asodfaosdf"
  );
});
const clock1 = setInterval(() => {
  if (fs.readdirSync("./test1").length === length) {
    fs.appendFileSync("./result.text", `father & son:${Date.now() - d1}\n`);
    clearInterval(clock1);
  }
}, 200);
// process.exit();
