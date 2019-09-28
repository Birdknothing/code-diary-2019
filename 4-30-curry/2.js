const cp = require('lodash/fp/compose')
const fs = require('fs')
const ws = fs.createReadStream('./1.js')
const toString = x => x.toString()
const toUpperCase = x => x.toUpperCase()
const test = x => {console.log(x);return x}
const map = f => x => x.map(f)
const tt = ['a','b','c']
const cg = cp(test,toUpperCase,test,toString)
const test0 = cp(test(toUpperCase),toString)
ws.on('data',test0)
const w = map(toUpperCase)
const bb = f => x => x.filter(f)
const f1 = x => x > 'a'
console.log(w(tt))
console.log(bb(f1)(tt))