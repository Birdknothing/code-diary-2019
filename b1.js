let test = con => {
  return con ? (test = () => 0)() : (test = () => 1)();
};
console.log(test(false));
console.log(test());
console.log(test());
console.log(test());
