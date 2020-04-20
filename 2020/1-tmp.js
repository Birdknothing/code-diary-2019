const a = {
    x() {
        const self = this;
        return new Promise(res => {
            setTimeout(() => {
                res("hello");
            }, 1000);
        }).catch(self.y);
    },
    y(err) {
        console.log("err");
    }
};
a.x().then(()=>{})
