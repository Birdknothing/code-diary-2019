const fs = require('fs'),
  path = require('path'),
  entries = {},
  excludeDir = ['node_modules'];
const pushDir = dir => {
  fs.readdirSync(dir).forEach(furl => {
    const fpath = path.join(dir, furl);
    const stat = fs.statSync(fpath);
    const basename = path.basename(path.resolve(dir, furl));
    // 如果是文件夹那么basename就是文件夹名
    if (stat.isDirectory() && !excludeDir.includes(basename)) {
      // console.log(fpath);
      pushDir(fpath);
    }
    // 如果是文件那么basename就是文件名加后缀
    if (stat.isFile()) {
      const fname = furl.split('.')[0];
      if (fname === 'index') {
        entries[path.basename(path.resolve(dir))] = fpath.replace(/[\\]/g, '/');
      }
    }
  });
};
pushDir('./');
console.log(entries);
console.log('./a/b/c');
const m = [1, 2, 3];
console.log(m.splice(m.length, 0, ...[4, 5]));
console.log(m);
