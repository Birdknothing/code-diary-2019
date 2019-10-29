let a = 1;
const fs = require("fs");
// const pwrite = require("util").promisify(fs.writeFile);
const wtFile = fname => {
    fs.writeFile("./2" + fname, "123");
};
console.log("h");
// const ck = setInterval(() => {
//     console.log(1);
//     a++;
//     a === 3 && clearInterval(ck);
// }, 1000);
console.log(process.cwd());

for (; a !== 3; a++) {
    wtFile("/" + a + ".text");
}
setInterval(() => {
    if (a === 3) {
        process.exit();
    }
    if (fs.existsSync("./2/2.text")) {
        process.exit();
    }
    a++;
}, 1000);
process.on("warning", w => {
    console.log(w);
});
