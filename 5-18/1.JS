class test {
  constructor(f){
    this.val = f
  }
  before(f){
    return new test((...args)=>{
      f.apply(this,args)
      this.val.apply(null,args)
    })
  }
  after(f){
    return new test((...args)=>{
      this.val.apply(null,args)
      f.apply(this,args)
    })
  }
}
const a = new test(()=>{console.log('hello world')})
const b = a.before(()=>{console.log('before hello')}).after(()=>{console.log('after world')})
b.val()