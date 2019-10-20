const fs = require("fs");
const log = console.log;
const core = require("./io.js");
function sonHear(msg) {
  console.log("son was told :" + msg);
  return msg;
}
process.on("message", msg => {
  switch (sonHear(msg)) {
    case "hello":
      sonSay("hi");
    case "son?":
      sonSay("yes");
    default:
      return;
  }
});
function sonSay(msg) {
  process.stdout.write(msg);
}
