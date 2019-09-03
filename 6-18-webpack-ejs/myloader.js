function delConsole(str) {
  console.log('myloader being entered !!');
  let w = str
    .replace(/\/\/ dev--.*?\/\/ --dev/gs, '')
    .replace(/^.*(?=console).*$/gm, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/[\r\n]/g, '');
  return w;
}
module.exports = function(data, map, meta) {
  return delConsole(data);
};
