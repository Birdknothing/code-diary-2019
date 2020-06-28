const a = ()=>{
    const y = "test";

    return ()=>{
        console.log(arguments.callee.name);
        
        console.log(y);
        
    }
}
a()();