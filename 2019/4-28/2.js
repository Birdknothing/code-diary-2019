// const  ar = [[[1,2],3,[4,5]],6,[[7,8],9,[10,11]]]
const fs = require('fs')
const fr = fs.createReadStream('./1.js')
const b = new Promise((res,rej)=>{
  fr.on('data',(chunk)=>{res(chunk)})
})
const f = function(t) {setTimeout(()=>{console.log('then')},t)}
b.then(chunk=>{
  console.log(chunk.toString())
})
