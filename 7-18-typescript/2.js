var E;
(function (E) {
    E[E["Foo"] = 0] = "Foo";
    E[E["Bar"] = 1] = "Bar";
})(E || (E = {}));
function f(x) {
    // if (x !== E.Foo || x !== E.Bar) {
    //   //             ~~~~~~~~~~~
    //   // Error! Operator '!==' cannot be applied to types 'E.Foo' and 'E.Bar'.
    // }
}
f(2);
var x = function () { return ({ name: 'Alice' }); };
var y = function () { return ({ name: 'Alice', location: 'Seattle' }); };
x = y; // OK
var u = function (x) {
    return x;
};
u({ x: 1, y: '2' }).y;
var tts = { x: 0, y: '2' };
var mySquare = { height: '12' };
var pn = [1, 2, 3];
console.log(pn[0]);
var pets = new Set(['Cat', 'Dog', 'Hamster']);
for (var pet in pets) {
    console.log(pet); // "species"
}
for (var _i = 0, pets_1 = pets; _i < pets_1.length; _i++) {
    var pet = pets_1[_i];
    console.log(pet); // "Cat", "Dog", "Hamster"
}
