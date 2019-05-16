const cg = console.log.bind(console)
Function.prototype.before = function(f){
  let self = this
    return function(...args) {
    f.apply(this,args)
    self.apply(this,args)
  }
}
Function.prototype.after = function(f){
  let self = this
    return function(...args) {
      self.apply(this,args)
      f.apply(this,args)
  }
}
function b() {
  cg('b')
}
b.before(()=>cg('a')).after(()=>cg('c')).before(()=>cg('0')).after(()=>cg('1'))()
const nf = Object.create(Function.prototype)