const { spawn } = require("child_process");
const ps = spawn("node", ["1.js"], { stdio: ["pipe", "pipe", "pipe"] });
