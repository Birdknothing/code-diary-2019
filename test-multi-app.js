const { spawn } = require("child_process");
const p1 = spawn("node", ["app1.js"]);
const p2 = spawn("node", ["app2.js"]);
p1.stdout.on("data", data => {
  console.log("p1", data.toString());
});
p2.stdout.on("data", data => {
  console.log("p2", data.toString());
});
