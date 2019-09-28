const compose = require('lodash')
var g = function(x){ return x.length; };
var f = function(x){ return x === 4; };
var isFourLetterWord = compose(f, g);
const spt = String.prototype.split.call(this,this)
// console.log(spt())
console.log('abc'.length)