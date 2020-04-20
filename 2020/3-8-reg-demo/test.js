const fs = require("fs");
const hm = ["php", "html"];
// const exp = new RegExp(`(?<=(href|src) *= *(['"]))([^"']+)(?=\\2)`, "g");// 上面正则中的第二个[^'"]是为了匹配形如 /a/b/ 最后还有一个/的情形
const exp = new RegExp(
  `((?<=(href|src) *= *(['"]))([^"']+)(?=\\3))|((?<=url[(](['"]?))[^'"\(\)]+(?=(\\2)[)]))`,
  "g"
); // 上面正则中的第二个[^'"]是为了匹配形如 /a/b/ 最后还有一个/的情形
const nn = new RegExp(
  `((?<=(href|src) *= *(['"]))([^"'; ]+)(?=\\3))|((?<=url[(](['"]?))[^'"\(\)]+(?=(\\2)[)]))`,
  "g"
);
fs.writeFileSync('./test',fs.readFileSync('../../1-tmp.html').toString().match(nn).join('\n'));
