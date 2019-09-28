// curry compose functor
export const curry = (f, length = f.length) => {
  return (...args) => (length - args.length > 0 ? curry((...argsRest) => f.call(f, ...args, ...argsRest), length - args.length) : f.apply(null, args));
};
export const compose = (...args) => x => args.reduceRight((acc, f) => f(acc), x);
export const map = curry((f, arr) => arr.map(f));

// dom find
export const $id = document.getElementById.bind(document);
export const $class = className => {
  const tmp = document.getElementsByClassName(className);
  return tmp.length === 1 ? tmp[0] : Array.from(tmp);
};
export const $style = curry((style, dom) => {
  Object.assign(dom.style, style);
  return dom;
});

// dom bind event
export const $bind = curry((ename, f, dom) => {
  dom.addEventListener(ename, f.bind(dom));
  return dom;
});
export const $unbind = curry((ename, f, dom) => {
  dom.removeEventListener(ename, f);
  return dom;
});
