const express = require('express')
const app = express()
app.listen(3000)
app.use('/h',(req,res)=>{
  // res.header("Access-Control-Allow-Origin","*")
  if(Object.keys(req.query).length > 0) {
    res.send(JSON.stringify(req.query))
    return
  }
  console.log(req)
  res.send('hello world')
})