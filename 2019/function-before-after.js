class M {
  constructor(f0) {
    this.f = f0;
  }
  after(fn) {
    let self = this;
    return (...args) => {
      fn.apply(fn, args);
      self.f.apply(null, args);
    };
  }
}
const w = () => {
  console.log(arguments[arguments.length]);
};
let t = new M(w);
t.after(() => {
  arguments[arguments.length] = '3';
  console.log(2);
})();
