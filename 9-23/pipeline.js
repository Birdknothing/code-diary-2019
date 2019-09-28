const fs = require('fs')
const rs = fs.createReadStream('./1.js')
const ws = fs.createWriteStream('./2.js')
const wss = fs.createWriteStream('./3.js')
const {pipeline} = require('stream')
pipeline(rs,ws,err => {
  if(err){
    console.log(err);
    
  }else{
    console.log('ok');
    
  }
})