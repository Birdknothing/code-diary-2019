const a = () => {
    const y = "test"
    return function w(){
        console.log(this)
        console.log(y)
    }
}
const n = function m(){
    console.log(arguments.callee.name);
}
n();
// a()();
class myUseState {
    _val =null;
    _fmap = {};
    constructor(val){
        this._val = val;

        return [this._val]
    }

}
const manager = {
    _fmap:{},
    myUseState(val){
        this._fmap
    },
    pushF(fname,val){
        !this._fmap[fname] && (this._fmap[fname] = [val])
    },
    setVal(ctx){
        return nval => (ctx.)
    }
};

function myUseState(val){

}