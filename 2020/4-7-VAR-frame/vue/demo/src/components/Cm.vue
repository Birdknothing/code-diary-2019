<template>
    <div>
        <h2>{{ title }}</h2>
        <div class="changeTitle">
            <input
                type="text"
                v-model="newTitle"
                @keyup.13="cgTitle(newTitle)"
            /><span class="change" @click="cgTitle(newTitle)">修改</span>
        </div>
        <div class="addBox">
            <input
                type="text"
                v-model="todo"
                @keyup.enter="newItem(todo)"
            /><span class="add" @click="newItem(todo)">新增</span>
        </div>
        <ul class="items">
            <li class="item" v-for="(item, i) in list" :key="i">
                <span class="txt">{{ item.name }}</span
                ><span class="del" @click="delItem(item)">删除</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: {
        list: Array,
        title: String
    },
    data() {
        return {
            newTitle: "",
            todo: ""
        };
    },
    methods: {
        newItem(name) {
            this.$emit("addItem", name);
        },
        delItem(item) {
            this.$emit("delItem", item);
        },
        cgTitle(nval) {
            this.$emit("cgTitle", nval);
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/common.scss";
.items {
    display: flex;
    margin: 0 auto;
    width: 200px;
    align-items: center;
    flex-direction: column;
    @extend %cmBasic;
    padding: 5px 10px;
}
.addBox,
.changeTitle {
    @extend .items;
    flex-direction: row;
}
.item {
    display: flex;
    width: 100%;
    height: 40px;
    align-items: center;
    justify-content: space-between;
}
.txt {
    width: 50px;
    border-bottom: 1px solid #ddd;
}
.del {
    @extend %cmBtn;
}
.add,
.change {
    @extend .del;
    white-space: nowrap;
}
</style>
