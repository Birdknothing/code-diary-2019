const express = require('express')
const Wechat = require('./wechat')
const app = express()
app.listen(80)
app.get('/',(req,res)=>{
  // 首次握手确认后台服务器
  Wechat.of({token:'shaofeibo'}).isFromWx(req) && res.send(req.query.echostr)
  console.log(Wechat.of({token:'shaofeibo'}).isFromWx(req))
  res.send('hello')
})