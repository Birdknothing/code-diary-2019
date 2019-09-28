const a = function(o = {x,y}) {
  Object.keys(o).forEach(console.log)
}
a({x:1,y:2})
class b {
  constructor(obj){
    let {x,y,m} = obj
      Object.assign(this,obj)
      this.z = Date.now()
  }
}
let c = new b({x:1,y:2})
console.log(c.z)
console.log(c.z)
console.log(c.m)
setTimeout(()=>{console.log(c.z)},1000)
console.log('123'.slice(-2))