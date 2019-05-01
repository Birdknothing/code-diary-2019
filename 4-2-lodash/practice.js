function apply(fn, thisArg, args){
  switch (args.length) {
    case 0: return fn.call(thisArg);
    case 1: return fn.call(thisArg, args[0]);
    case 2: return fn.call(thisArg, args[0], args[1]);
    case 3: return fn.call(thisArg, args[0], args[1], args[2]);
  }
  return fn.apply(thisArg, args);
}
// module.exports = apply
function arrayAggregator(arr, setter, iteratee, accumulator) {
  var index = -1,
      length = arr == null ? 0 : arr.length;

  while(++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), arr)
  }
  return accumulator;
}
function arrayEach(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length;
  while(++index < array.length) {
    if(iteratee(array[index], index, array) === false) {break}
  }
  return array
}
function arrayEach(array, iteratee) {
  var length = array == null ? 0 : array.length;
  while(length--) {
    if(iteratee(array[length], index, array) === false) {break}
  }
  return array
}
function arrayReduce(array, iteratee, accumulator, initAcc) {
  var index = -1,
      length = array == null ? 0 : array.length;
  if(initAcc && length) {
    accumulator = arr[++index]
  }
  while(++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array)
  }
  return accumulator
}