const wrapSafe  = (f,wrongMsg="") => (...args) => {
  if(wrongMsg){
    return wrongMsg;
  }
  const someParamNull = args.some(param => typeof param !== 'function' && param == undefined)
  if(someParamNull){
  wrongMsg = "wrong";
  return "wrong";
  }
 return f(...args)
}
const test = (x) => {
  console.log(x+1)
}
const wrapTest = wrapSafe(test);
wrapTest(null)
const m = [1,2,null]
// console.log(m.some(ele => ele == undefined));
