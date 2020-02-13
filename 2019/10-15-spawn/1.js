const {spawn,spawnSync} = require('child_process');
const p1 = spawnSync('node',['2.js']);
console.log('father');
