const fs = require("fs");
console.log(fs.readFileSync('./1-tmp.js').toString().replace(/(?<!const)[\s\n]/g,""));