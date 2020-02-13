
const async_hooks = require('async_hooks')
const fs = require('fs')
console.log('global ',async_hooks.executionAsyncId());
fs.open('./1.js','r',function(){

  const eid = async_hooks.executionAsyncId();
  const eid2 = async_hooks.triggerAsyncId();
  console.log(this);
  console.log(eid,eid2);
})
fs.writeFile('./2.text', Buffer.from('132'), function() {
  const eid = async_hooks.executionAsyncId();
  const eid2 = async_hooks.triggerAsyncId();
  console.log(eid,eid2);
  console.log(this);
  
})
