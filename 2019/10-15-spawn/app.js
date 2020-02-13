const fs = require("fs");
const { spawn } = require("child_process");
// const execP = require("util").promisify(exec);
const p1 = spawn("cat", ["1.text"]);
const p2 = spawn("grep", ["1.text"]);
// (async function() {
//   const { stdout } = await p1;
//   p2.stdin.write(stdout);
// })();
p1.stdout.on("data", ck => {
  p2.stdin.write(ck.toString());
});
p1.on("close", () => {
  p2.stdin.end();
});
p1.stderr.on("data", data => {
  console.log("err: ", data);
});
p2.stdout.on("data", ck => console.log(ck + ""));
fs.writeSync(0, "ls");
