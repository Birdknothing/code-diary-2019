onmessage = e => {
  console.log('hha');
  postMessage(respond(e.data));
};
const respond = msg => {
  if (typeof msg !== 'string') return;
  const rbt = new Map([['hi', 'hello'], ['suck', 'you suck too'], ['day', 'yh,today is a good day']]);
  const often = ['you', 'me', 'i', 'is', 'a', 'an', 'the', 'was', 'are', 'good', 'bad'];
  for (let [key, val] of rbt.entries()) {
    if (msg.includes(key)) {
      return val;
    }
  }
  msg.split(/\s+/).forEach(kword => {
    if (!often.includes(kword)) {
      rbt.set(kword, 'fuk u idont konw what to say');
    }
  });
};
