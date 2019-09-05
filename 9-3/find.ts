const superagent = require('superagent-charset')(require('superagent'));
// const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const Cheerio = require('cheerio');
// const url = 'http://demo.16xiazai.com'; // 首页，入口页 gbk
const url = 'http://www.fesucai.com/index.html'; // 首页，入口页 utf-8
const website = 'http://www.fesucai.com';
const dirName = 'public2'; // 保存在的文件夹
const source = ['.js', '.css', '.jpg', '.png', '.gif']; // 要保存哪些除了js css外的静态资源
const links = ['/', '.html', '.php']; // 其他链接入口
// 生成的目录结构
const struct = {
  ['/' + dirName]: {
    assets: {}
  }
};

const curry = (f: Function, l: number = f.length) => (...args) => (l - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), l - args.length) : f.call(f, ...args));
const compose = (...args: Function[]) => x => args.reduceRight((acc, f) => f(acc), x);
const getHtml = (url, form = 'utf-8') =>
  new Promise(res => {
    superagent
      .get(encodeURI(url))
      .charset(form)
      .end((err, result) => {
        if (err) {
          console.error({ url, err });
          res('wrong');
        }
        let target = result.text;

        const preCheckForm = JSON.stringify(result.headers) + result.text;
        const matchForm = preCheckForm.match(/charset=([^'"]+)/);
        // charset不对（如gbk）则用对的charet再去请求一次
        if (matchForm && matchForm[1] && matchForm[1] !== form) {
          console.log(path.basename(url), matchForm[1]);
          getHtml(url, matchForm[1]).then(res);
          return;
        }
        res(target);
      });
  });
// url里面可能包含中文，要encodeURI
const getAssets = (url: string) => superagent.get(url);

// 拿$
const get$ = (html: string) => Cheerio.load(html);
// 往assests内push资源文件名
const pushAsset = (obj: object, type: string, filename: string, cb: Function) => {
  // 已包括此文件不操作
  if (obj['assets'][type] && obj['assets'][type].includes(filename)) {
    return;
  }
  // 已有资源项目新文件
  if (obj['assets'][type] && !obj['assets'][type].includes(filename)) {
    obj['assets'][type].push(filename);
  }
  // 新资源项目
  if (!(type in obj['assets'])) {
    (obj['assets'][type] = []).push(filename);
  }
  cb();
};
// 根据文件名和内容写string文件
const writeFile = curry((name: string, content: string) => {
    fs.writeFileSync(path.join(dirName, name), content);
});
// 创建
const mkDir = (targetDir, relativePath) => {
  const location = path.resolve(targetDir, relativePath);
    fs.mkdirSync(location);
  // if (type === 'file') {
  //   fs.appendFileSync('./allfilename', location + '\n');
  //   fs.writeFileSync(location, content);
  // }
};
// 根据是否存在来创建文件夹或文件，同时创建记录
const mkAll = (pathurl, store = struct['/' + dirName]) => {
  // pathurl不能包括域名
  pathurl = pathurl.replace(/.*:\/\/[^/]*/g, '');
  const urlArr = pathurl.split('/');
  let nowPath = './';
  urlArr.reduce((acc, dirname) => {
    // 空字符串不进入创建
    if (!dirname) {
      return acc;
    }
    // 文件创建记录和实际文件
    if (dirname.includes('.')) {
      // 考虑 a.min.b.js的情况
      pushAsset(acc, dirname.match(/.*(\.\w+)/)[1], dirname, () => {
        const assetPath = website + pathurl;
        // 写文件
          getAssets(assetPath).pipe(fs.createWriteStream(path.resolve(dirName, nowPath + dirname)));
      });
      return acc;
    }
    // 文件夹或记录已存在不创建
    if (!(dirname in acc)) {
      acc[dirname] = { assets: {} };
      // 建文件夹
      mkDir(dirName, nowPath + dirname);
    }
    nowPath += dirname + '/';
    return acc[dirname];
  }, store);
};
// 写根据url爬到的文件
const writeHtml = (url, name) => getHtml(url).then(writeFile(name));

// 功能部分,爬取当前页所有资源类型文件,url必须包含网址和协议
const scratch = async (url: string, source: string[], store = struct['/' + dirName]) => {
  const html = await getHtml(url);
  const pname = url.match(/http[s]?:\/\/[^/]+(.*)/)[1]; // 为一级路径时可能为 '/' 或 ''
  const filename = !pname || pname === '/' ? 'index.html' : path.basename(pname);
  if (html === 'wrong') {
    return;
  }
  writeHtml(url, filename);
  // const $ = get$(html as string);
  // $('script,link').each(function() {
  //   fs.appendFileSync('./jscssPath', ($(this).prop('src') || $(this).prop('href')) + '\n');
  //   mkAll($(this).prop('src') || $(this).prop('href'));
  // });
  // 图片等
  source.forEach(extname => {
    // .jpg .png .gif 等 考虑到 background:url(/a/b/c.jpg)的情况
    const exp = extname !== ('.css' || '.js') ? new RegExp('(?<=[("])[^"(]+\\' + extname, 'g') : new RegExp('[^"]+\\' + extname, 'g');
    const result = (html as string).match(exp);
    if (result) {
      result.forEach(pathurl => {
        mkAll(pathurl);
      });
    }
  });
  fs.writeFileSync('./'+(pname || 'index')+'Struct.js', 'module.exports = ' + JSON.stringify(struct, null, 4));
};
  // 根据首页获得所有非资源链接
  const getPageLinks = async (url:string) => {
    const html = await getHtml(url);
    links.forEach(feat => {
      const exp = new RegExp('(?<=href=")([^"]+\\' + feat + ')(?=")', 'g');
      const result = new Set((html as string).match(exp));
      if (result) {
        result.forEach(newurl => {
          fs.appendFileSync('./link', newurl + '\n');
          if (!newurl.includes('://')) {
            newurl = website + newurl;
          }
          // 有些被encodeURI过的字符串要解码
          scratch(decodeURI(newurl), source);
        });
      }
    });
  }
scratch(url, source);
