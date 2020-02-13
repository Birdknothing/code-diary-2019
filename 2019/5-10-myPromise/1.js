const  delay = (w,f,val) => {setTimeout(() => {
  w[f](val)
});}
class Prom {
  constructor(fns) {
    // let self = this
    let res =  x => {this.val = x;this.status === 'pending' && (this.status = 'resolved') && delay(this,'on',x)}
    let rej =  x => {this.val = x;this.status === 'pending' && (this.status = 'rejected') && delay(this,'off',x)}
    this.status = "pending"
    this.val = ''
    this.onArr = []
    this.offArr = []
    try{
    fns(res,rej)
    }catch(e){
      // this.status = "rejected"
      rej(e)
      // setTimeout(()=>{this.off(e)})
    }
  }
  on(x) {this.onArr.forEach(f => f(x))}
  off(x) {this.offArr.forEach(f => f(x))}
  then(on,off) {
        typeof on === 'function' && this.onArr.push(on)
        typeof off === 'function' && this.offArr.push(off)
        return this
  }
}
new Prom((a1,a2)=>{
  // a1('wrong')
  throw new Error('wrong')
  // a2('wrong')
  // setTimeout(a1,2000,'hello')
}).then(console.log,console.log).then(console.log,console.log)