console.log('/a/b/'.split('/'));
const path = require('path');
const fs = require('fs');
const tmp = {};
const mkdir = (pathurl, store = struct['/' + dirName]) => {
  pathurl.split('/').reduce((acc, dirname) => {
    if (!dirname) {
      return acc;
    }
    if (!(dirname in acc)) {
      acc[dirname] = { assets: {} };
    }
    return acc[dirname];
  }, store);
};
mkdir('/a/b/c', tmp);
// const exp = /[^"]+\.js/g;
// const exp = new RegExp('(?<=[("])[^"(]+\\.' + 'jpg', 'g');
// console.log(exp);
// const str = `background:url(/a/b/12423.jpg) no-repeate","<img src="/12/23.jpg">`;
// console.log(str.match(exp));
// console.log(JSON.stringify(tmp, null, 4));
// console.log(path.resolve('public', '/a/b/c'));
// console.log('https://www.baicu.com/a/b'.replace(new RegExp('.*' + 'www.baicu.com','g'), ''));
// console.log(new RegExp('(?<=[("])[^"(]+\\.' + 'extname', 'g'),new RegExp('[^"]+\\.' + 'extname', 'g'));
// console.log('a.b.js'.match(/.*(\.\w+)/)[1])
const exp = new RegExp('(?<=href=")([^"]+\\' + '.html' + ')(?=")', 'g');
const str = '<script href="http://www.baicu.com/a/b/"></script>href="/a/b/c.html"';
console.log(str.match(exp));
console.log(`http://www.fesucai.com/article/`.includes('://'));
const arr = ['http://www.baicu.com/a/b', 'http://www.baicu.com/a/b', 'http://www.jd.com'];
const after = new Set(null);
console.log(after);
//  after.forEach(ele => {
//    console.log(ele)
//  })
console.log(decodeURI(`https://www.fesucai.com/tags.php?/html5%E6%B8%B8%E6%88%8F%E5%BC%80%E5%8F%91/`));
console.log(decodeURI(`https://www.fesucai.com/tags.php?/html5游戏开发/`));
const aa = `哈哈:：《>黑河aa`;
console.log(encodeURI(':：哈哈aa'));

const m = {
  __proto__:{
    x:1
  }
}
const n ={}
Object.assign(n,m)
console.log(n)
// n.__proto__.x = m.__proto__.x;
// const n = JSON.parse(JSON.stringify(m));
;
console.log(`https://www.baicu.com/`.match(/http[s]?:\/\/[^/]+(.*)/)[1]);
console.log(path.basename('/a/b/c.index.html'))
