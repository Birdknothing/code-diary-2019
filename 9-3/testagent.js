const superagent = require('superagent-charset')(require('superagent'));
const fs = require('fs');
const path = require('path');
const Cheerio = require('cheerio');
const iconv = require('iconv-lite');
const url = encodeURI('https://www.fesucai.com/skin/images/weixin.jpg');
var b = 10;
b.b = 10;
'10'.toString();
const c = {
  valueOf() {
    return 1;
  }
};
var a = [1, 2, 3];
a.join = a.shift;
if (a == 1 && a == 2 && a == 3) {
  console.log(1);
}
var b = String(123);
if (b === '123') {
  console.log('bbb');
}
const getAssets = (url, encoding = 'utf-8') => superagent.get(url);
  // new Promise((res, rej) => {
  //   superagent
  //     .get(url)
  //     .charset(encoding)
  //     .end((err, result) => {
  //       if (err) {
  //         rej(err);
  //       }
  //       if (!result.text) {
  //         rej('no content from ' + url);
  //       }
  //       console.log(iconv.decode(result.text.slice(0, 100),'utf-8'));
  //       res(result.text);
  //     });
  // });
// getAssets('http://www.fesucai.com/uploads/1903/1-1Z316100600542.jpg')
//   .then(c => {
//     console.log(typeof c);
//     // fs.writeFileSync('./test.jpg', c.toString('binary'));
//     console.log(c.includes('\r\n'))
//     fs.createWriteStream('test.jpg');
//   })
//   .catch(console.log);
 getAssets(url).pipe(fs.createWriteStream('./testtt.jpg'))
