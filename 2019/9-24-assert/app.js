const express = require('express')
const fs = require('fs')
const async_hooks = require('async_hooks')
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    fs.writeSync(
      1, `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  }
}).enable();
const app = express();
app.listen(3001);
app.get('/', (req, res) => {
  res.send('hi')
})
