const fs = require("fs");
const path = require("path");
const {promisify} = require('util');
const targetPath = "E:\\a\b";
const replaceInitRequire = str =>
  str.replace(/InitRequire\("([^"]*)"\)/g, function(orstr, path1) {
    return `require("${path.resolve(targetPath, path1)}")`;
  });
console.log(
  replaceInitRequire(`InitRequire("Edbox/js/Edbox.Base.js");
InitRequire("Edbox/js/Edbox.LocationLoad.js");
InitRequire("Edbox/js/Edbox.Fixed.js");
InitRequire("Edbox/js/Edbox.List.js");
InitRequire("Edbox/js/Edbox.Dictionary.js");
InitRequire("Edbox/js/Edbox.Require.js");`)
);
console.log(promisify.toString());
console.log(path.basename('/a/b/'));
let originStr = `abc;\n
 c = InitPath(module);\n`
originStr = originStr.replace(/(.*(?=InitPath\(module\)).*)/m, "//$1");
// console.log(originStr.match(/(.*(?=InitPath\(module\)).*)/m))

console.log(originStr);
