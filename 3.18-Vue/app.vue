<template>
    <div>
        <Son :p1='str[0]' :p2='str[1]' @fdel='del' />
    </div>
</template>
<script>
import Son from './son.vue'
export default {
    data(){
        return {
            str:['test1','test2']
        }
    },
    methods:{
        del(){
            this.str = this.str.map(ele=>ele.slice(0,-2))
        }
    },
    components:{
        Son
    }
}
</script>
<style>

</style>

