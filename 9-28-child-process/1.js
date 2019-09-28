const fs = require('fs')
const cp = require('child_process')
const { spawnSync, spawn } = cp;
const c2 = spawn('node', ['2.js'], { stdio: 'ignore'} )
fs.writeSync(1, 'parent process\n');

c2.stdout.on('data', chunk => console.log(chunk + '')
);
c2.on('close', code => {
  console.log('exit code is ' + code);
})
