const rbt = new Map([['hi', 'hello'], ['suck', 'you suck too'], ['day', 'yh,today is a good day']]);
const often = ['you', 'me', 'i', 'is', 'a', 'an', 'the', 'was', 'are', 'good', 'bad'];
const respond = msg => {
  if (typeof msg !== 'string') return;
  for (let [key, val] of rbt.entries()) {
    if (msg.includes(key)) {
      return val;
    }
  }
  let kw = '';
  msg.split(/\s+/).forEach(kword => {
    if (!often.includes(kword)) {
      rbt.set(kword, prompt('fuk u  teach me what to say'));

      kw = kword;
    }
  });
  return rbt.get(kw);
};
export default respond;
