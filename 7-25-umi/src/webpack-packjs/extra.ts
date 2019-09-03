const curry = (f, length = f.length) => {
  return (...args) =>
    length - args.length > 0
      ? curry((...argsRest) => f.call(f, ...args, ...argsRest), length - args.length)
      : f.apply(null, args);
};
const $bind = curry((ename, f, dom) => {
  dom.addEventListener(ename, f.bind(dom));
  return dom;
});
const $class = className => {
  const tmp = document.getElementsByClassName(className);
  return tmp.length === 1 ? tmp[0] : Array.from(tmp);
};
($class('tabHead') as Element[]).forEach(div => {
  $bind(
    'click',
    function() {
      this.previousElementSibling.checked = true;
    },
    div,
  );
});
