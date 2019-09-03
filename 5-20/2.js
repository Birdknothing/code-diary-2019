let m = ''
async function a(){
  let b = await new Promise((res)=>{
    setTimeout(res,2000,'haha')
  })
  m = b
  return b
}
// a().then(()=>{
//   console.log('b')
// })
a().then((res)=>{
  console.log('m='+m)
  setTimeout(res,4000,'nextnext')
}).then(data => {
  console.log('now here')
  console.log(data)
})