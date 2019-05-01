/**
 * 判断字符串是否既包含a又包含b
 * 断言永远都只是一个if判断的作用，判断该不该去匹配字符串，满足条件采取匹配
 */
// import fs from 'fs'
const fs = require('fs')
var exp = /(?=.*a)(?=.*b)^.*$/g,
    str = 'aaaa',
    str0 = 'ab',
    arr = [],
    cg = console.log;
    cg(str.search(exp))
    cg(str0.search(exp))
!fs.existsSync('1.txt') && fs.createWriteStream('1.txt').write('abc')
fs.existsSync('1.txt') && fs.createReadStream('1.txt').on('data',chunk => {
    arr.push(chunk)
}).on('end',()=>{
    console.log(typeof Buffer.concat(arr))
    console.log(typeof new Buffer(10))
    console.log(new Buffer.alloc(10).fill('a',8,9))
    console.log(Buffer.concat(arr))
    arr.push(Buffer.alloc(2))
    fs.createWriteStream('2.txt').write(Buffer.concat(arr).fill('cd',4).toString())
})
console.log(process.argv[1])
