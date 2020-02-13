const express = require('express')
const app = express()
app.listen(3001)
app.get('/h',(req,res) => {
  res.header("Access-Control-Allow-Origin","file:///D:")
  res.send('hello world abc')
})
app.use(express.static('./public'))