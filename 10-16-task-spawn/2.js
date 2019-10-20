const fs = require("fs");

process.on("message", msg => {
  // console.log(msg);
  fs.writeFileSync("./3.text", msg + "heieh");
});
setTimeout(() => {
  // console.log("hello world");
}, 3000);
