const curry = (f, l = f.length) => (...args) =>
    l - args.length > 0 ? curry((...argsLeft) => f.call(f, ...args, ...argsLeft), l - args.length) : f.call(f, ...args);
const { spawn } = require("child_process");
const p = spawn("node", ["2.js"], { stdio: ["ipc"] });
const log = curry((extra, str) => console.log((extra || "") + str.toString()));
p.stdout.on("data", log(""));
p.send("father say hi");
process.on("message", log("father receive :"));
