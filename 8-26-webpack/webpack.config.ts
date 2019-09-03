// 'use strict';
// 需要安装 cross-env 苹果windows都能设置全局变量,安装 concurrently 使npm可以运行两个监听命令
// "build": "concurrently \"egg-bin dev\" \"cross-env PACK_WEB=0 webpack -w\"",
// 配置部分
const path = require('path'),
  fs = require('fs'),
  // 静态资源路径,可设置 @web
  srcUrl = './app/public/web',
  // 设置默认 1 为生产环境，0 为开发环境
  envName = 'PACK_WEB',
  // 要检索index.[any]的目录
  workUrl = './',
  // 除此目录下的index.js都将被检索加入
  excludeDir = ['node_modules', 'dist', 'loader'],
  entryExt = ['js', 'ts', 'jsx', 'tsx'],
  // 注意，如果要将css变成内联，style-loader是必不可少的,可cnpm 下载
  scssRules = [{ test: /\.scss$/, sideEffects: true, use: ['style-loader', 'css-loader', { loader: 'sass-loader', options: { outputStyle: 'compressed' } }] }],
  cssPlugins = [],
  // css放到js文件中,注意由于样式也是js写入，因此最好js写到异步进程里，比如jq的$(function(){/* code */}),否则webpack报错
  cssInJs = true,
  // 是否采用所有自定义loader,注意已设定只有生成模式可用
  useMyLoader = true,
  entries = {},
  // !注意 这里必须 npm i -D extract-text-webpack-plugin@next
  Extract = require('extract-text-webpack-plugin'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'), // 必需的插件,会清洗output下的path目录
  BabelMinify = require('babel-minify-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  jsLoader = ['babel-loader'],
  htmlPlugins = [];
// 是否采用所有自定义loader具体实现
if (useMyLoader && process.env[envName] === '1') {
  // jsLoader.splice(jsLoader.length, 0, './loader');
  jsLoader.splice(0, 0, './loader');
}
// 是否cssInJs？
if (!cssInJs) {
  scssRules.splice(0, 1);
}
// 自动遍历检索文件夹，入口文件名为 -- index.[any] 文件 所在目录名 ： index.[any] 文件地址
const pushDir = dir => {
  fs.readdirSync(dir).forEach(furl => {
    const fpath = path.join(dir, furl);
    const stat = fs.statSync(fpath);
    const basename = path.basename(path.resolve(dir, furl));
    // 如果是文件夹那么basename就是文件夹名
    if (stat.isDirectory() && !excludeDir.includes(basename)) {
      pushDir(fpath);
    }
    // 如果是文件那么basename就是文件名加后缀
    if (stat.isFile()) {
      const [fname, extname] = furl.split('.');
      if (fname === 'index' && entryExt.includes(extname)) {
        const htmlName = path.basename(path.resolve(dir));
        // 入口js[x],ts[x]文件,必须得是 './a/b/c'的格式,join默认为'a\\b\\c'
        entries[htmlName] = './' + fpath.replace(/[\\]/g, '/');
        // html文件
        htmlPlugins.push(
          new HtmlWebpackPlugin({
            filename: htmlName + '.html',
            title: htmlName,
            inject: false,
            css: cssInJs ? [] : [htmlName + '.css'],
            js: [htmlName + '.js'],
            template: './template/index.html'
          })
        );
        // cssInJs ?
        if (cssInJs) {
          // scssRules.push({ test: /\.scss$/, sideEffects: true, use: ['css-loader', { loader: 'sass-loader', options: { outputStyle: 'compressed' } }] });
          return;
        }
        cssPlugins.push(new Extract(`./${htmlName}.css`)); // 必须写相对路径，还必须是相对于output的路径
        scssRules.push({ test: new RegExp(`${htmlName}.scss`), sideEffects: true, use: cssPlugins[cssPlugins.length - 1].extract(['css-loader', { loader: 'sass-loader', options: { outputStyle: 'compressed' } }]) });
      }
    }
  });
};
pushDir(workUrl);
const myPlugin = {
  apply: compiler => {
    console.log('compiler.hooks', Object.keys(compiler.hooks)); // 生命周期
    console.log('compiler.hooks', typeof compiler.hooks.emit.tapAsync); // 可访问compilation且在进入output目录前
    // compiler.hooks.emit.tapAsync('myPlugin', (compilation, cb) => {
    //   console.log('\033[42;30m compilation\033[0m', Object.keys(compilation.assets));
    //   const emp1 = compilation.assets['index.js']['children']['0']['_value']; // 可拿到编译完后的index.js二进制文件
    //   const emp2 = compilation.assets['index.js']['children']['1']['_value'];
    //   fs.writeFileSync('./testt1.js', emp1);
    //   fs.writeFileSync('./testt2.js', emp2);
    //   console.log(Object.keys(compilation.assets['index.js']['children']['0']));
    // });

    // compiler.hooks.compilation.tap('compilation', compilation => {
    //   console.log('\033[42;30m compilation\033[0m'); // 每次文件改动都会触发此处
    //   console.log(Object.keys(compilation));
    //   console.log('comilation assets', Object.keys(compilation.assets));
    //   console.log('comilation modules', Object.keys(compilation.modules));
    //   console.log('comilation modules', Object.keys(compilation.modules));
    //   console.log('comilation name', compilation.name);
    //   compilation.hooks.normalModuleLoader.tap('any', (loadContext, modules) => {
    //     console.log('compilation loader');
    //     console.log(Object.keys(loadContext), modules.loaders['0']);// loader的地址
    //   });
    // });
    // compiler.hooks.watchRun.tapAsync('myPlugin1', (compiler, cb) => {
    //   console.log('watch happen'); // 每次文件改动都会触发此处

    //   cb(); // 这里一定要执行cb，才能正常监听
    // });
  }
};
console.log('entries', entries);
console.log('env', process.env[envName]);
module.exports = {
  entry: entries,
  mode: process.env[envName] === '1' ? 'production' : 'development',
  devtool: process.env[envName] === '1' ? false : 'inline-source-map',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@web': path.resolve(srcUrl)
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.(png|jpg)$/, use: ['file-loader'] },
      /*{ enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },*/
      { test: /\.js$/, sideEffects: true, use: jsLoader },
      ...scssRules
    ]
  },
  // optimization: {
  //   minimizer: [new BabelMinify()]
  // },
  plugins: [...htmlPlugins, ...cssPlugins, new CleanWebpackPlugin()],
  devServer: {
    // 默认localhost
    host: 'localhost',
    // 也可以是数组，放入多个目录
    contentBase: './dist',
    compress: true,
    port: 8686
  }
};
