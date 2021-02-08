const a = new Promise((res,rej) =>{
  rej('fuck')
  res('he')
});
(async ()=>{
  console.log(await a);
  
})()