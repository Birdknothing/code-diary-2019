async function a(){
  console.log('123')
  return await  Promise.race([new Promise((res)=>{setTimeout(res,1000,2)}),new Promise((res)=>{setTimeout(res,4000,2)}),new Promise((res)=>{setTimeout(res,1000,2)})])
}
function b(x){
  console.log(x)
}
a().then(b)