const { spawn, spawnSync } = require("child_process");
const sp = spawn("node", ["4.js"], {
    detached: true,
    stdio: "inherit"
});
sp.on("exit", () => {
    console.log("s stop");
});
console.log("f");
