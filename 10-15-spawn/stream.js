const fs = require("fs");
const Readable = require("stream").Readable;
const Writable = require("stream").Writable;
const ws = new Writable({
  write(ck, en, cb) {
    !this.data && (this.data = "");
    this.data += ck.toString();
    cb();
  },
  final(cb) {
    console.log("final");
    cb();
  }
  // autoDestroy: true
});
ws.setDefaultEncoding("utf-8");
ws.on("error", err => {
  console.log("err", err);
});
const rs = new Readable({
  read() {
    this.push("hello");
    this.push("hello");
    this.push("hello");
    this.push("hello");
    this.push("hello");
    this.push(null);
  }
});
// let a1 = ws.write("h");
// let a2 = ws.write("w");
// rs.on("data", ck => {
//   ws.write(ck + "");
// });
// rs.on("end", () => {
//   console.log(ws.data);
// });
rs.pipe(ws);
// ws.end();
setTimeout(() => {
  console.log(ws.data);
}, 2000);

// rs.on("data", ck => {
//   console.log(ck + "");
// });
