module.exports = function(str, map, meta) {
  const w = str
    .replace(/\/\/ dev--.*?\/\/ --dev/gs, '')
    .replace(/.*(?=console\.log).*/gm, '')
    .replace(/(?<![:"'=/])\/\/.*$/gm, '');
  this.callback(null, w, map, meta);
  return;
};
