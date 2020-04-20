const methods = {
    newItem(name) {
        this.list.addItem(name);
    },
    delItem(item) {
        this.list.rmItem(item);
    }
};
