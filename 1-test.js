const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
(async () => {
    const str = await readFile("./1-crlf.js");
    console.log(str.toString().indexOf("\n"));
    console.log(str.toString().indexOf("\r\n"));
})();
