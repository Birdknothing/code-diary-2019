const tt = new Map([[1,'a'],[4,'b'],[8,'c']])
const m = new Promise((res,rej) => {
  setTimeout(res,2000,4)
})
async function bb() {
  const w = await m
  return w
// tt.forEach(async (value,key) => {
//   let c = await m;
//   if(key === c){
//     return value
//   }
// })

}
function c(cb){
  console.log('abc')
  cb()
}

function d(){
  console.log('def')
}
bb().then(()=>{
  c(d)
})
console.log( -1 == '-1')
