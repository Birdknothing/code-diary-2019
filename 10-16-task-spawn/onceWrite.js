const fs = require("fs");
const d1 = Date.now();
const handleErr = err => err && fs.writeSync(1, err);
const length = require("./length").length;
Array.from({ length }).forEach((ele, i) => {
  // fs.writeFile(`./test/${i + 1}.js`, "lorem lorem  asodfaosdf", handleErr);
  fs.writeFileSync(`./test/${i + 1}.js`, "lorem lorem  asodfaosdf");
});
// fs.appendFile("./result.text", `once:${String(Date.now() - bg)}\n`, handleErr);
// const clock = setInterval(() => {
//   if (fs.readdirSync("./test").length === length) {
//     fs.appendFileSync("./result.text", `once:${Date.now() - bg}\n`);
//     clearInterval(clock);
//   }
// }, 100);
const clock2 = setInterval(() => {
  if (fs.readdirSync("./test").length === length) {
    fs.appendFileSync("./result.text", `once:${Date.now() - d1}\n`);
    clearInterval(clock2);
  }
}, 200);
