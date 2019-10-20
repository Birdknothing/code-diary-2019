const { spawn } = require("child_process");
const log = console.log;
const sp = spawn("node", ["s.js"], { stdio: ["ipc", "inherit"] });
function fatherSay(msg) {
  sp.send(msg);
}
const core = require("./io.js");
function listenIO(core) {
  if (core.who === 0) {
    fatherSay(core.msg);
    core.who = 1;
  }
}
setInterval(() => {}, 1000);
sp.send("hello");
process.on("message", msg => {
  process.stdin.write("father receive: " + msg);
});
