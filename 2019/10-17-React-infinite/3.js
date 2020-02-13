function edit(val) {
    if (!val || typeof val !== "object") {
        return;
    }
    const { ftype } = val.row || {};
    switch (ftype) {
        case 1:
            return;
        
        case 2:
            return;
        
        default:
            return;
    }
}
