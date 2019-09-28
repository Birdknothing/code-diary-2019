class A {
  constructor(x) {
    this.val = x
  }
  a1() {
    console.log('a1')
  }
  a2() {
    console.log('a2')
  }
}
class B extends A {
  b1() {
    this.a1()
  }
}
new B().b1()
