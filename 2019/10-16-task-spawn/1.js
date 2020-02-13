const { spawn, spawnSync } = require("child_process");
const d1 = Date.now();
const p1 = spawn("node", ["3.js"], { stdio: "ignore" });
// console.log(p1.stdout);
// p1.stdout.on("data", ck => {
//   console.log(ck.toString());
// });
// p1.send("hello0011", () => {});
p1.on("close", () => {
  console.log(Date.now() - d1);
});
// p1.stdout.on("data", ck => {
//   console.log(ck.toString());
// });
// console.log(p1.stdout.toString());
// p1.disconnect();
