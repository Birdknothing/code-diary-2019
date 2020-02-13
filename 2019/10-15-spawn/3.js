// setTimeout(() => {
//   console.log("3.js");
// }, 4000);
let i = 0;
const c1 = setInterval(() => {
  console.log("3.js");
  // i += 1;
  // i === 4 && process.exit();
}, 1000);
console.log("sync 3.js");
process.exit();
