const express = require('express')
const sess = require('express-session')
const parseurl = require('parseurl')
const app = express()
app.use(
  sess({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 30000
    }
  })
)
app.use(function(req, res, next) {
  if (!req.session.views) {
    req.session.views = {}
  }
  // if (!req.ttt) {
  //   req.ttt = {}
  // } 
  // get the url pathname
  var pathname = parseurl(req).pathname

  console.log(Sin(req).__proto__ === req.__proto__)
  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1
  // req.ttt[pathname] = (req.ttt[pathname] || 0) + 1

  next()
})

const single = function() {
  let cache = ''
  return function(val) {
    return cache || (cache = val)
  }
}
const Sin = single()
app.get('/h', function(req, res, next) {
  // console.log(Sin(res) === res)
  // console.log(Sin(req).session.views)
  // console.log(req.session.views)
  res.send('you viewed this page ' + req.session.views['/h'] + ' times')
})

app.get('/bar', function(req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})
app.listen(3000)
// app.use('/h',(req,res)=>{
//   // res.header("Access-Control-Allow-Origin","*")
//   res.send('hello world')
// })
