const fs = require("fs");
const { spawn, spawnSync } = require("child_process");
const testF = function() {
    console.log("sth");
};
const cp = spawn("node", ["2.js"], { stdio: ["ipc"] });
cp.send("hello");
const log = x => fs.writeSync(1, x);
// const log = console.log;
setTimeout(() => {
    console.log("heh");
}, 2000);
process.on("exit", () => {
    console.log("sync exit");
});
process.on("beforeExit", log);
// process.on("exit", log);
// process.exit();
