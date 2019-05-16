// const cookie = 'userName=sfb;expire=1234;userPassword=1234;'
// Vue(
//   data() {
//       arr : ['userName','userPassword','identity'] // arr 放到 vue 的data里面
//   })

  // data() {
   const cookieObj = {userName:'',userPassword:'',identity:''}
  // }
function getCookie(str,obj) {
  for(var key in obj) {
    obj[key] = (str.match(new RegExp(`(?<=${key}=)[^;]*(?=\;)`,'g')) || [undefined])[0]
  }
  // return arr.keys().map(ele => (str.match(new RegExp(`(?<=${ele}=)[^;]*(?=\;)`,'g')) || [undefined])[0])
}
// this.getCookie(document.cookie,this.cookieObj)
const m = {x:1}
console.log(Object.assign({x:2},m)) // {x:1}
const k = {}
const w = {x:1,y:2}
for(let [key,value] of Object.entries(w)) {
  console.log( {key,value} )
};
