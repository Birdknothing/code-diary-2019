const superagent = require('superagent-charset')(require('superagent'));
// const iconv = require('iconv-lite');
const fs = require('fs');
const path = require('path');
const Cheerio = require('cheerio');
// const url = 'http://demo.16xiazai.com'; // 首页，入口页 gbk
const url = 'http://www.fesucai.com/index.html'; // 首页，入口页 utf-8
const website = 'http://www.fesucai.com';
const websitename = 'www.fesucai.com';
const dirName = 'public2'; // 保存在的文件夹
const source = ['.js', '.css', '.jpg', '.png', '.gif']; // 要保存哪些除了js css外的静态资源
const links = ['/', '.html', '.php']; // 其他链接入口
const wrongFileNameCode = ['\\', '/', ':', '*', '?', '"', '<', '>' ,'|']; // 这些符号不能出现在windows新文件名中，最好用_代替，且'\'必须用双\\ 表示,encodeURIComponent才能转义'/',而encodeURI和escape都无法做到
const depth = 1;
// 所有带协议资源链接 http://websitename/a/c.css
let allAssets = [];
// 带协议的实际链接
let allPages = [url];
// 一些路由比如 /admin/login 如果要建此文件，需要保存转义后的文件名
let filenameArr = [];
// 已经爬取过的页面
let pagesDone = [];
// 包含有其它网址的链接
let extraWebsites = [];
// 生成的目录结构
const struct = {
  ['/' + dirName]: {
    // 不能叫assets，因为可能刚好和某个子文件夹重名
    $assets: {}
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
        if (err || !result || !('text' in result)) {
          console.error({ url, err });
          res('wrong');
          return;
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
const getAssets = (url: string) => superagent.get(encodeURI(url));

// 拿$
const get$ = (html: string) => Cheerio.load(html);
// 往assests内push资源文件名
const pushAsset = (obj: object, type: string, filename: string, cb: Function) => {
  // 已包括此文件不操作
  if (obj['$assets'][type] && obj['$assets'][type].includes(filename)) {
    return;
  }
  // 已有资源项目新文件
  if (obj['$assets'][type] && !obj['$assets'][type].includes(filename)) {
    obj['$assets'][type].push(filename);
  }
  // 新资源项目
  if (!(type in obj['$assets'])) {
    (obj['$assets'][type] = []).push(filename);
  }
  cb();
};
// 根据文件名和内容写string文件
const writeFile = curry((name: string, content: string) => {
  // 所有相关原网址自动删除
  content = content.replace(new RegExp('http[s]?:\\/\\/'+websitename,'g'),'');
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
      acc[dirname] = { $assets: {} };
      // 建文件夹
      mkDir(dirName, nowPath + dirname);
    }
    nowPath += dirname + '/';
    return acc[dirname];
  }, store);
};
// 写根据url爬到的文件
const writeHtml = (url, name) => getHtml(url).then(writeFile(name));

// 功能部分,爬取当前页所有资源类型文件,url必须包含网址和协议,同时将爬取过网页加以记录
const scratch = async (url: string) => {
  if (pagesDone.includes(url)) {
    return 'yes';
  }
  pagesDone.push(url);
  console.log('scratch: ',url+'\n');
  const html = await getHtml(url);
  if (html === 'wrong') {
    return 'no';
  }
  const pname = url.match(/http[s]?:\/\/[^/]+(.*)/)[1]; // 为一级路径时可能为 '/' 或 '',文件名不能以'/'开头
  const filename = !pname || pname === '/' ? 'index.html' : encodeURIComponent(pname);
  // 创建当前页
  writeHtml(url, filename);
  // 拿静态资源链接数组等
  (await getAssetsLinks(source, html as string)).forEach(pathurl => {
    mkAll(pathurl);
  });
  getPageLinks(links, html as string);
  return 'yes';
};
const rmDupli = (oarr): string[] => (oarr === null ? null : Array.from(new Set(oarr)));
// 根据文本html和资源类别数组获取所有资源链接
const getAssetsLinks = async (source: string[], content: string) => {
  source.forEach(extname => {
    // .jpg .png .gif 等 考虑到 background:url(/a/b/c.jpg)的情况,对于js，css必须是 /a/b/c.js 不能是a/b/c.js
    const exp = extname !== ('.css' || '.js') ? new RegExp('(?<=[("])/[^"(]+\\' + extname, 'g') : new RegExp('[^"]+\\' + extname, 'g');
    const result = rmDupli((content as string).match(exp));
    if (result) {
      allAssets = rmDupli(allAssets.concat(result));
    }
  });
  return allAssets;
};
// 根据文本html和页面特征数组获得所有页面链接
const getPageLinks = (links: string[], content: string): string[] => {
  links.forEach(feat => {
    const exp = new RegExp('(?<=href=")([^"]+\\' + feat + ')(?=")', 'g');
    // 去重
    const result = rmDupli((content as string).match(exp));
    if (result) {
      // 给这些页面加上默认的协议头
      allPages = rmDupli(allPages.concat(result.map(ele => {
        // 有别的网址的链接
        if(ele.includes('://')){
          extraWebsites.push(ele);
          return ele;
        } 
        return website + ele;
    })));
    }
  });
  return allPages;
};
// 根据allpages爬取所有页面链接，过滤重复url，并存入url地址
const getMoreLinks = async () =>{
  for(let ind in allPages){
    // 保存url并将改名后的页面名保存到数组
    const url = allPages[ind];
    // 写文件
    let html = await getHtml(url);
    if(html === 'wrong') {
      return 'no';
    }
    // 过滤所有包含http://www.baic.com类似的网址信息
    html = (html as string).replace(new RegExp('http[s]?:\\/\\/'+websitename,'g'),'');
    // 搜索所有页面链接并存入
    getPageLinks(links,html as string);
    
    const pname = url.match(/http[s]?:\/\/[^/]+(.*)/)[1]; // 为一级路径时可能为 '/' 或 '',文件名不能以'/'开头
    const filename = !pname || pname === '/' ? 'index.html' : encodeURIComponent(pname);
    filenameArr[ind] = filename;
    writeFile(filename, html);
  }
}
// 根据allPages和filenameArr获取所有静态资源，过滤重复url，然后创建文件
const getMoreAssets = async () => {
  
}
(async () => {
  for (let i = 0; i <= depth; i++) {
    for (let pageurl of allPages) {
      await scratch(pageurl);
    }
  }
  console.log(allAssets.length);
  fs.writeFileSync('./Struct.js', 'module.exports = ' + JSON.stringify(struct, null, 4));
  fs.writeFileSync('./assets', allAssets.join('\n'));
  fs.writeFileSync('./pages', allPages.join('\n'));
})();