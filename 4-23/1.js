console.log('全国'.split(','))
const a = new Promise((res,rej)=>{
  setTimeout(res('hello'),3000)
})
const b =  new Promise((res,rej)=>{
  const e = function(){
    console.log([...arguments])
  }
  res(e)
})
a.then(console.log)