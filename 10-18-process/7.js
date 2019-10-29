const fs = require("fs");
setTimeout(() => {
    fs.writeFileSync("./22.text", 123);
}, 2000);
