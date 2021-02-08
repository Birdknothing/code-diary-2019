const data = {
    title: "",
    todo: "",
    list: [{ name: "eat" }, { name: "drink" }],
    cgTitle(nval) {
        this.title = nval;
    },
    addItem(name) {
        this.list.push({ name });
    },
    rmItem(item) {
        this.list.splice(this.list.indexOf(item), 1);
    }
};
export default data;
