setTimeout(() => {
  console.log("setTimeout");
}, 2000);
process.nextTick(() => {
  console.log("tick");
});
console.log("main");

process.on("beforeExit", code => {
  console.log("beforeexit with :" + code);
});
process.on("exit", code => {
  console.log("exit with: " + code);
});
