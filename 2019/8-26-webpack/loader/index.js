module.exports = function(str, map, meta) {
  // 注意网页里是否有http://xxx，这里的双斜杠是否可能被匹配到
  // return str;
  const w = str
    // 删除所有 "// dev--" 和 "// --dev" 之间的代码，注意双斜杠后有空格,s用来加强.字符代表所有字符包括\n
    .replace(/\/\/ dev--.*?\/\/ --dev/gs, '')
    // 删除 只要包含 "console.log" 就算的那行代码(m)
    .replace(/.*(?=console\.log).*/gm, '')
    // 删除所有 "//" 后面的代码，保护 ://  "//  '//  =//  ///
    .replace(/(?<![:"'=/])\/\/.*$/gm, '');
  // this.callback(
  //   err: Error | null,
  //   content: string | Buffer,
  //   sourceMap?: SourceMap,
  //   meta?: any
  // );

  // this.loaders 所有loader组成的数组
  // this.resource 资源部分
  console.log('this.resource', this.resource); // 文件绝对路径
  console.log('this.context', this.context); // 文件所在文件夹绝对路径
  console.log('this.request', this.request);
  this.callback(null, w, map, meta);
  return;
};
