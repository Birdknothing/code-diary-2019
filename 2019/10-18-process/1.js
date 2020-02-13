function m(){
  return 1 || 2;
}
console.log(m());
const w = '?lan=123&'
console.log((w.match(/lan=([^&]+)/) || [])[1])