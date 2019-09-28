function cir(n,total) {
  if( n === 1 ) return total;
  return arguments.callee(n-1 , n * total)
}
console.log(cir(5,1))

function circle(n){
  if(n === 1) return 1;
  return n * arguments.callee(n-1)
}
console.log(circle(5))

function Fibonacci0 (l, m = 1,  n= 1) {
  if(l <= 1) return n;
  return Fibonacci0(l-1, n , m + n)
}
console.log(Fibonacci0(50))

function Fibonacci (n) {
  if ( n <= 1 ) {return 1};
  return Fibonacci(n - 1) + Fibonacci(n - 2);
}
console.log(Fibonacci(50))