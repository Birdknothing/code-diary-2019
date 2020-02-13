const fs = require('fs')
const rs = fs.createReadStream('1.text')
const ws = fs.createWriteStream('2.text')
console.log(ws.writableHighWaterMark);
const myRs = new require('stream').Readable({read(){
  const self = this;
  Array.from({length:10}).map((nouse,i) => i+1).forEach(ele => {
    self.push(ele.toString())
  })
  self.push(null)
}})
myRs.on('error',err => {
  if(err){
    console.log('err',err);
    ws.destroy();
  }
})
myRs.pipe(ws)
// const tmp = []
// rs.pipe(ws);
// rs.on('error', () => {
//   ws.destroy();
// })
ws.on('finish', () => {
  console.log('ws is finished');
})
// rs.on('drain', () => {
//   console.log('rs is drain');

// })
// rs.on('end', () => {
//   const str = Buffer.concat(tmp).toString()
//   console.log('rs end str is ' + str);
// })
// rs.on('data', chunk => {
//   tmp.push(chunk)
// })