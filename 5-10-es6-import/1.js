class a{
  static b() {
    console.log('haha')
  }
  constructor(x) {
    this.x = x
  }
  c() {
    console.log('a.c()')
  }
}
class h extends a{
  static c() {
    super.b()
  }
  constructor(x){
    super(x)
  }
  m() {
    super.c()
  }
}
const d = new h(1)
h.c()
console.log(d.m())
console.log(d.x)