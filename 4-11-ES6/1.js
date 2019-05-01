const cg = console.log
function m() {
  cg(Array.from(arguments, ele => typeof ele))
}
m([],{x:1},4,'str')
cg(Array.from('string'))
let g = [1,2]
g.concat([3,4])
cg(g)