var str = `<div><img src='http://124.234.32:9090?12&1'   >'http:dsd.jpg'<img src="http://123.34.png"></div>`
/**
 * (?!)和(?=)都不占宽度，这意味着后面的
 * /(?=.*a)(?=.*b)/g 判断一个字符串里是否既有a又有b字符
 * \1也不会将其算进去，不过里面如果有其他()也会算一个位置,且一定和第一个括号内字符相同
 * string.match有g参数则返回数组，匹配到的元素依次排列
 * string.match无g参数则返回arr,arr[0]为匹配到的元素，arr[1]
 * (?<=)是从后向前扫描，这意味着其用在前面匹配必须有的字符
 * (?=)是从前往后扫描，这意味着其用在后面匹配必须有的字符又不占宽度
 * (?<！)和(?!)一样
 */
var e = /(?<=src=)(['"])[^'"]*\1(?=[\s]*)/g
var f = /src=['"]([^'"])*['"]/g
console.log(str.match(e))
// var arr = str.match(f)
// arr = arr.map(ele => ele.split('=')[1])
console.log('-------------------')
console.log(e.exec(str))
console.log(e.exec(str))
var reg = /\?from=(\w+)(\#)=end/;
var ss = 'http://www.baidu.com?from=monvhh#=endbalabla#'
var result = ss.match(reg);
var whatiwant = result[1];//monvhh
console.log(result)
var str1 = 'this is a dog,that is a cat'
var str2 = 'this is a dog,thaat is a cat'
var ee = /.*(?<=this).*(?!that).*/g
console.log(ee.exec(str1))
console.log(ee.exec(str2))