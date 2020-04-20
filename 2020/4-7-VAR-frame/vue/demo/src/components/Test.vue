<template>
    <div>
        <h3>{{ title }}</h3>
        <input
            type="text"
            v-model="newTitle"
            @keyup.enter="cgTitle(newTitle)"
        />
        <input type="text" v-model="newTodo" @keyup.enter="add(newTodo)" />
        <button class="add" @click="add(newTodo)">新增</button>
        <ul class="items">
            <li v-for="(ev, i) in list" :key="i" class="item">
                <span>{{ ev.name }}</span>
                <button @click="list.splice(i, 1)" class="del">删除</button>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ["title"],
    data() {
        return {
            title: "",
            todo: "",
            list: [{ name: "eat" }, { msg: "drink" }]
        };
    },
    created() {},
    mounted() {
        // this.$set(this.events[1],"name","test");
        this.list[1].name = "test";
    },
    methods: {
        add(val) {
            this.list.push({ name: val });
        },
        cgTitle(val) {
            this.$emit("cgTitle", val);
        }
    }
};
</script>

<style scoped lang="scss">
@import "@/common.scss";
.test {
    color: blue;
    margin: 0 auto;
}
ul {
    width: 200px;
    @extend %flex_bt;
    flex-direction: column;
    height: 600px;
}
li {
    width: 100%;
    @extend %flex_bt;
    justify-content: space-between;
    margin-top: 20px;
    span {
        height: 100%;
    }
    @extend %commonBtn;
    border: 1px solid #ddd;
}
.add {
    @extend %commonBtn;
}
.del {
    display: inline-block;
    @extend %commonBtn;
    border: 1px solid #ddd;
    color: red;
}
</style>
