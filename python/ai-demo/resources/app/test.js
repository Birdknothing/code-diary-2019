const path = require("path");
const child_process = require("child_process");
const execFile = () =>
    child_process.execFile("test.bat", null, { cwd: path.resolve(process.cwd(), "test") }, function (error, stdout, stderr) {
        if (error !== null) {
            console.log("exec error" + error);
        }
    });
execFile();
