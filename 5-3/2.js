(()=>{
  for(key in Object.getOwnPropertyNames(Array.prototype)) {
    this[key] = x => args => args[key](x)
  }
})()
const a = 'abc'
console.log(this.split)
console.log(split('b')(a))