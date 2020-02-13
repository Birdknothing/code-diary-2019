const fs = require("fs");
const qs = ["are you male?", "are you over 18?"];
let result = "",
  i = 0;
function ask(qs) {
  process.stdout.write(qs);
}
function log(x, y) {
  if (y) {
    fs.writeSync(1, y);
    return;
  }
  console.log(x);
}
process.stdin.on("data", ass => {
  // 输入最后会带上0d(CR),0a(LF)回车和复位键
  ass = ass.slice(0, -2).toString();
  if (i === 0) {
    result += ass === "yes" ? "you are male," : "you are not male,";
  }
  if (i === 1) {
    result += ass === "yes" ? "you are an adult," : "you are a teenager,";
  }
  ++i;
});
function doOnce(f) {
  let c = "";
  return (cond, msg, exitCond) => {
    // log("exit= " + exitCond);
    if (exitCond) {
      clearInterval(ck);
      process.exit();
    }
    if (cond !== c && msg) {
      f(msg);
      c = cond;
    }
  };
}
const askOnce = doOnce(ask);
const ck = setInterval(() => {
  askOnce(i, qs[i], i === 2);
}, 1000);
process.on("exit", () => {
  log(result);
});
