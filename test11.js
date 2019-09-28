const fs = require('fs'),
  process = require('child_process'),
  util = require('util');
let execute = util.promisify(process.exec);
// pro.exec('ls', (error, out, err) => {
// console.log(out);
// console.log(/\r/g.test(out));
// });
fs.watchFile('./test22.js', async (pre, cur) => {
  console.log(await execute('node ./test22.js'));
});
(async function() {
  console.log(await execute('ls'));
})();
// fs.watchFile('./test11.js')
