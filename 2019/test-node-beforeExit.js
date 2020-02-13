const fs = require("fs");
process.on("beforeExit", () => {
    console.log("beforeExit");
});
process.on("exit", () => {
    fs.writeSync(1, "exit");
});
// process.exit();
