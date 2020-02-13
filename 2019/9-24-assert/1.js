const assert = require('assert')
const fs = require('fs')
// try {
//   assert.deepStrictEqual(/a/gi,new Date())
// } catch (error) {
//   console.log(error);

// }
// console.log({} === {});
const a11 = { x: 1 }
const a22 = { x: 1 }
// Object.setPrototypeOf(a22, {})
// assert.strictEqual(a11, a22)
// assert.deepStrictEqual(a11,a22)

// Object.defineProperty(a1,'x',{enumerable:false})
// assert.deepEqual(a1, a2)
// assert.deepStrictEqual(a1, a2)
// assert.doesNotReject(Promise.resolve('hha'))
const async_hooks = require('async_hooks');
const asyncHook = async_hooks.createHook({
  init(aid, type, triggerId, resource) {
    // console.error('init : ' + aid, type, triggerId, resource);
    fs.appendFileSync('./async', 'init : ' + aid + ' ' + type + ' ' + triggerId + ' ' + JSON.stringify(resource) + '\n')
    fs.writeSync(1, aid, type, triggerId)
  },
  destroy(asyncId) {
    // console.log('destory : ' + asyncId);

  }
}).enable()
// console.log(1);
fs.writeSync(1, 'haha')
process.nextTick(() => {
})

// console.log('global ', async_hooks.executionAsyncId());

// fs.writeFile('./2.text', Buffer.from('132'), () => {
//   console.log('done');
//   const eid = async_hooks.executionAsyncId();
//   const eid2 = async_hooks.triggerAsyncId();
//   console.log(eid, eid2);

// })
// Return the ID of the current execution context.
// const eid2 = async_hooks.executionAsyncId();
// console.log(eid2);