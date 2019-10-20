const fs = require('fs')
var module = function() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
const t = x => (x & 0x3) | 0x8;
// console.log(t(9).toString(16));
// console.log(t(12).toString(16));
// console.log(t(14).toString(16));
// console.log(t(15).toString(16));
for (let i = 0; i < 16; i++) {
  // console.log(t(i).toString(16));
  fs.writeSync(1,t(i).toString(16))
}

console.log(module());
