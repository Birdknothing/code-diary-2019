<template>
    <div>
        <h2>{{ title }}</h2>
        <input type="text" v-model="newTitle" @keyup="cgTitle(newTitle)" />
        <ul>
            <li
                class="item"
                v-for="({ name }, i) in items"
                :key="i"
                v-on:click="delItem(i)"
            >
                {{ name }}<span class="del">删除</span>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newTitle: "newTitle",
            items: [{ name: "eat" }, { msg: "drink", title: "test" }]
        };
    },
    props: {
        title: String
    },
    methods: {
        addItem(name) {
            this.items.push({ name });
        },
        delItem(i) {
            this.items.splice(i, 1);
        },
        cgTitle(nval) {
            this.$emit("cgTitle", nval);
        }
    },
    mounted() {
        setTimeout(() => {
            this.items[1].name = "sleep";
            this.addItem("shit");
        }, 2000);
    }
};
</script>

<style lang="scss" scoped>
@import "@/common.scss";
.del {
    @extend %cmBtn;
}
ul {
    width: 200px;
    margin: 0 auto;
}
%cmFlex {
    display: flex;
    justify-content: space-between;
}
.item {
    height: 40px;
    @extend %cmFlex;
}
</style>
