process.on("message", str => {
    console.log("son receive ", str.toString());
});
setTimeout(()=>{
    process.send('hi father')
},2000)