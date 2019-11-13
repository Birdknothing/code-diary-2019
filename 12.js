var a = function(){
    var b = {x:1}
    a = ()=>b;
    return b;
}
console.log(a());
a().x =2;
console.log(a());