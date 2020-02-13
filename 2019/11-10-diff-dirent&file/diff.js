const fs = require("fs");
const path = require("path");
const direntsArr = [];
const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x);
const curry = (f, length) => {
    length = length || f.length;
    return (...args) =>
        length - args.length > 0
            ? curry((...restArgs) => f.call(this, ...args, ...restArgs), length - args.length)
            : f.apply(this, args);
};
function recordDirent(url) {
    fs.readdir(url, { encoding: "utf8", withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(err);
            throw err;
        }
        files.forEach(
            compose(
                x => {
                    [].push.bind(direntsArr)(x);
                    fs.statSync(x).isDirectory() && recordDirent(x);
                },
                curry((x, y) => path.resolve(x, y))(url),
                x => x.name
            )
        );
    });
}
function trim(str){
    return str.replace(/\n/g,'').replace(/\s/g,'')
}
function diff(arr, dir1Name, dir2Name) {
    try {
        arr.forEach(adr => {
            if(fs.statSync(adr).isDirectory()){return}
            const d1str = fs.readFileSync(adr).toString();
            const exp = new RegExp("\\\\" + dir1Name + "\\\\");
            const d2str = fs.readFileSync(adr.replace(exp, `\\${dir2Name}\\`)).toString();
            if (trim(d1str) !== trim(d2str)) {
                console.log(adr);
            }
        });
    } catch (error) {
        fs.writeFileSync()
    }
}
recordDirent("./dir1");
setTimeout(() => {
    diff(direntsArr,'dir1','dir2')
}, 3000);
function readCt(url){
    return fs.readFileSync(url).toString();
}
const test1 = trim(readCt('e:\\code-diary-2019\\11-10-diff-dirent&file\\dir1\\src\\app.js'));
const test2 = trim(readCt('e:\\code-diary-2019\\11-10-diff-dirent&file\\dir2\\src\\app.js'));

console.log(test1 === test2);
// console.log(test2.replace(/\n/g,'').replace(/\s/g,''));

