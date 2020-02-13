import { string, object } from 'prop-types';

interface B {
  [index: string]: string;
}

interface A<W extends B> {
  W: string;
}
function W(x: A<string>, y: B) {
  console.log(x, y);
}
W({ b: '123' }, { b: '23' });
