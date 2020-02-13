const express = require('express')
const bodyParser = require('body-parser')
const superagent = require('superagent')
const app = express()
app.listen(3001)
app.use(bodyParser.json({limit:"1mb"}))
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',(req,res)=>{
  res.header("Access-Control-Allow-Origin","*")
  console.log(req.query)
  console.log(req.body)
  console.log(req.path)
  console.log(req.method)
  const data = req.query.proxy ? req.query : req.body
  let param = {}
  for([key,value] of Object.entries(data))
    key !== 'proxy' && (param[key] = value);
    // req.method === 'GET' && (param = req.query)
  superagent[req.method.toLowerCase()](data.proxy+req.path)[req.method === "GET" ? "query" : "send"](param).end((err,resp)=>{
    if(err !== null) {console.log(err);res.send('server error!');return}
    console.log(resp.text)
    res.send(resp.text)
  })
})
// app.use(express.static('./public'))