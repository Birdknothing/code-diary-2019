class B {
  public m: string;
  public w: string;
  protected h: string;
  constructor(x: string, _h: string) {
    this.w = x;
  }
  wSet(nval) {
    this.h = nval;
  }
  bark(msg) {
    console.log(`father is barking ${msg} !`);
  }
}
class C extends B {
  constructor(y: string, w: string) {
    super(y, w);
  }
  bark(msg) {
    super.bark(msg);
    console.log(`son is barking ${msg}`);
  }
  test() {
    this.h = 'var changed';
    console.log(this.h);
  }
}
class D {
  private _x: number;
  constructor(x) {
    this.x = x;
  }
  console() {
    console.log(this.x);
  }
  get x(): number {
    return this._x;
  }
  set x(nval: number) {
    nval > 5 && (this._x = nval);
  }
}
const exm = new C('123', 'B private');
exm.test();
exm.bark('wongwong');
const ww = new D(6);
ww.x = 4;
ww.console();
ww.x = 7;
ww.console();
ww.x = 2;
ww.console();
ww.x = 10;
ww.console();
