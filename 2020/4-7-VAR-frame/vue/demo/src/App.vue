<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <Cm :list="list" :title="title" @addItem="newItem" @delItem="delItem" @cgTitle="cgTitle"/>
    </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import Test from "@/components/Test.vue";
import Cm from "@/components/Cm.vue";

export default {
    name: "App",
    components: {
        Cm
    },
    data() {
        return {
            title: "test",
            todo: "",
            list: [{ name: "eat" }, { name: "drink" }]
        };
    },
    methods: {
        newItem(name) {
            this.list.push({ name });
        },
        delItem(item) {
            this.list.splice(this.list.indexOf(item), 1);
        },
        cgTitle(nval) {
            this.title = nval;
        }
    },
    mounted() {
      setTimeout(() => {
        this.title = "newTitle";
      }, 2000);
    }
};
</script>

<style lang="scss">
@import "@/common.scss";
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
ul,
li {
    list-style: none;
}

* {
    user-select: none;
    margin: 0;
    padding: 0;
}
input {
    @extend %cmBasic;
}
</style>
