const a1 = x => {console.log(x)}
const a2 = x => {console.log(x)}
class Prom {
  constructor(fns) {
    this.status = "pending"
    this.val = ''
    try{
    fns(this.resolve,this.reject)
    }catch(e){
      console.log(e)
      this.reject(e)
    }
  }
  resolve(x) {this.val = x;this.status === 'pending' && (this.status = 'resolved')}
  reject(x) {this.val = x;this.status === 'pending' && (this.status = 'rejected')}
  then(on,off) {
    switch (this.status) {
      case 'resolved':
        on(this.val)
      case 'rejected':
        off(this.val)
      default:
        ;
    }
  }
}
new Prom((a1,a2)=>{
  setTimeout(a1,2000,'hello')
}).then(console.log)