var str = `<div><img src='http://124.234.32:9090?12&1'   `//>'http:dsd.jpg'<img src="http://123.34.png"></div>`
/**
 * (?!)和(?=)都不占宽度，这意味着后面的
 * \1也不会将其算进去，不过里面如果有其他()也会算一个位置
 * string.match有g参数则返回数组，匹配到的元素依次排列
 * string.match无g参数则返回arr,arr[0]为匹配到的元素，arr[1]为其中的第一个()里匹配到的，arr[2]为第二个（）内匹配到的,...,这些均为索引下标，其余非索引下标有arr['index'],arr['input'],arr['group']
 * RegExp.exec(string)不管有无g参数都以类似string.match的无g形式返回数组，
 * exec()执行一次到第一个找到匹配结果的下标结尾，exec()再执行一次到第二个找到的匹配结果的下标结尾，当然每次得到的arr[0]都是每次找到的元素
 * 
 * 
 * ！！（）内的结果除了用 \1,\2在正则内表示
 * 在字符串中也可以表示，如str.replace(/(\w)/g,'$1')用 $1表示第一个括号内的内容，特别的 '$1'也可以是一个函数，即 arr[n] 和 $n 一样
 */
var e = /(?! src=)(['"])[^'"]*\1(?=[\s]*)/
var f = /src=['"]([^'"])*['"]/g
console.log(str.match(e))
// var arr = str.match(f)
// arr = arr.map(ele => ele.split('=')[1])
console.log('-------------------')
console.log(e.exec(str))
console.log(e.exec(str))
var reg = /\?from=(\w+)(\#)=end/;
var ss = 'http://www.baidu.com?from=monvhh=endbalabla#'
var result = ss.match(reg);
var whatiwant = result[1];//monvhh
console.log(result)